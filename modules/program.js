var JsonDB = require('node-json-db');
var db = new JsonDB("programas", true, true);
const adapter = require('./sensorAdapter.js');
var myEvents = require('./myEvents.js');


var assignedPrograms = {};

var getProgramas = function () {
    return db.getData("/programas");
};

var getAssignedPrograms = function () {
    return assignedPrograms;
};



var loadAssignedPrograms = function () {
    try {
        assignedPrograms = db.getData("/running");
    } catch (error) {
        assignedPrograms = {};
    }
};

loadAssignedPrograms();

var getCurrentStep = function (programa) {
    var now = new Date().getTime();
    var pasos = programa.pasos;
    var curSetp = null;
    for (var i = 0; i < pasos.length; i++) {
        if (pasos[i].startTime <= now && pasos[i].endTime >= now) {
            curSetp = pasos[i];
        }
    }
    return curSetp;

};

var schedule = function (programaBase, startTime) {
    var programa = JSON.parse(JSON.stringify(programaBase)); // copia del array, sin referencias
    var pasos = programa.pasos;
    for (var i = 0; i < pasos.length; i++) {
        pasos[i].duracion = pasos[i].dias * 86400000; // duracion de un dia en milisegundos
    }
    for (var i = 0; i < pasos.length; i++) {
        if (i === 0) {
            pasos[i].startTime = startTime;
            pasos[i].endTime = pasos[i].duracion + startTime;
        } else {
            pasos[i].startTime = pasos[i - 1].endTime + 1;// +1 de changui
            pasos[i].endTime = pasos[i].startTime + pasos[i].duracion;
        }
    }
    return programa;
};

var assign = function (data) {
    var now = new Date().getTime();
    var tacho = data.tacho;
    var programa = data.programa;

    var agendado = schedule(programa, now);
    assignedPrograms[tacho] = agendado;
    db.push("/running", assignedPrograms);
};
var save = function (programas) {
    db.push("/programas", programas);
};

var remove = function (tacho) {
    delete assignedPrograms[tacho];
    db.push("/running", assignedPrograms);
};

var sendFakeData = function () {
    monitor("0;23;24;25;26;23;24;25;26;0;0;0;0;");
};

var getCurrentValue = function (tacho, jsonData) {
    var clave = tacho.replace("t", "m"); //t1-> m1 .. y todo asi
    return jsonData[clave];

};

var adjust = function (tacho, value) {
    myEvents.emit("adjust", {tacho: tacho, value: value});
};

var adjustIfYouMust = function (tacho, jsonData) {
    var step = getCurrentStep(assignedPrograms[tacho]);
    var currentValue = getCurrentValue(tacho, jsonData);
    var stepTemp = step.temperatura+'.00';
    if (step != null && currentValue != stepTemp) {
        adjust(tacho, step.temperatura);
    }

};

var ultimoPasoTime = function (programa) {
    return programa.pasos[programa.pasos.length - 1].endTime;
};

var tieneProgramaActivo = function (tacho) {
    var programa = assignedPrograms[tacho];
    if (programa) {
        var now = new Date().getTime();
        return ultimoPasoTime(programa) > now;
    } else {
        return false;
    }
};

var getTachosConActivePrograms = function () {
    var tachos = Object.keys(assignedPrograms);
    var activos = [];
    tachos.forEach(function (tacho) {
        if (tieneProgramaActivo(tacho)) {
            activos.push(tacho);
        }
    });
    return activos;
};

var monitor = function (sensorData) {
    var jsonData = adapter.asJson(sensorData);
    var tachos = getTachosConActivePrograms();
    tachos.forEach(function (tacho) {
        adjustIfYouMust(tacho, jsonData);
    });

};


module.exports = {
    monitor: monitor,
    getProgramas: getProgramas,
    getAssignedPrograms: getAssignedPrograms,
    assign: assign,
    remove: remove,
    save: save
};