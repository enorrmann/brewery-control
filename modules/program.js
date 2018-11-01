var JsonDB = require('node-json-db');
var dataFolder = process.env.HOME + "/.config/brewery-control/";
var db = new JsonDB(dataFolder + "programas", true, true);
var logDb = new JsonDB(dataFolder + "log", true, true);
const adapter = require('./sensorAdapter.js');
var myEvents = require('./myEvents.js');

var assignedPrograms = {};
var lastSavedData = {};
var lastSavedTime = {};

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

var schedulePasos = function (pasos) {
    var startTime = pasos[0].startTime;
    for (var i = 0; i < pasos.length; i++) {
        pasos[i].duracion = pasos[i].dias * 86400000; // duracion de un dia en milisegundos
    }
    for (var i = 0; i < pasos.length; i++) {
        pasos[i].state = '';
        if (i === 0) {
            pasos[i].startTime = startTime;
            pasos[i].endTime = pasos[i].duracion + startTime;
        } else {
            pasos[i].startTime = pasos[i - 1].endTime + 1;// +1 de changui
            pasos[i].endTime = pasos[i].startTime + pasos[i].duracion;
        }
    }
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
    delete lastSavedData[tacho];
    delete lastSavedTime[tacho];
    var programa = data.programa;

    var agendado = schedule(programa, now);
    assignedPrograms[tacho] = agendado;
    db.push("/running", assignedPrograms);
};
var save = function (programas) {
    db.push("/programas", programas);
};

var addPaso = function (tacho, paso) {
    var pasos = db.getData("/running/" + tacho + "/pasos");
    var idx = paso.idx;
    pasos.splice(idx, 0, paso);
    schedulePasos(pasos);
    db.push("/running/" + tacho + "/pasos", pasos);
};

var remove = function (tacho) {
    delete lastSavedData[tacho];
    delete lastSavedTime[tacho];
    delete assignedPrograms[tacho];
    db.push("/running", assignedPrograms);
    logDb.delete("/running/" + tacho + "/log");
};

var getCurrentValue = function (fermentador, jsonData) {
    return jsonData[fermentador];
};

var getCurrentLimit = function (tacho, jsonData) {
    var clave = tacho.replace("t", "m"); //t1-> m1 .. y todo asi
    return jsonData[clave];
};

var adjust = function (tacho, value) {
    myEvents.emit("adjust", {tacho: tacho, value: value});
};

var getLog = function (fermentador) {
    return logDb.getData("/running/" + fermentador + "/log");
};

var logIfYouMust = function (fermentador, jsonData) {
    var now = new Date().getTime();
    var step = getCurrentStep(assignedPrograms[fermentador]);
    var currentVal = getCurrentValue(fermentador, jsonData);
    var currentLimit = getCurrentLimit(fermentador, jsonData);

    if (lastSavedData[fermentador] !== currentVal) {
        if (!lastSavedTime[fermentador] || (now - lastSavedTime[fermentador] > 600000)) { // si no hay valor de ultima grabacion.. o ya paso diex minutox
            lastSavedTime[fermentador] = now;
            lastSavedData[fermentador] = currentVal;
            var toSave = {
                fecha: getTimeString(now),
                paso: step.paso,
                status: jsonData.status,
                limite: currentLimit,
                temperatura: currentVal
            };
            logDb.push("/running/" + fermentador + "/log[]", toSave);
        } else {
        }
    }
};

var adjustIfYouMust = function (tacho, jsonData) {
    var step = getCurrentStep(assignedPrograms[tacho]);
    var currentValue = getCurrentLimit(tacho, jsonData);
    var stepTemp = step.temperatura + '.00';
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
    var fermentadores = Object.keys(assignedPrograms);
    var activos = [];
    fermentadores.forEach(function (fermentador) {
        if (tieneProgramaActivo(fermentador)) {
            activos.push(fermentador);
        }
    });
    return activos;
};

var monitor = function (sensorData) {
    var jsonData = adapter.asJson(sensorData);
    var fermentadoresActivos = getTachosConActivePrograms();
    fermentadoresActivos.forEach(function (fermentador) {
        adjustIfYouMust(fermentador, jsonData);
        logIfYouMust(fermentador, jsonData);
    });

};
var lead = function (number) {
    return (number < 10) ? "0" + number : number;
};

var getTimeString = function (milis) {
    var d = new Date(milis);
    return lead(d.getDate()) + "-" + lead(d.getMonth() + 1) + "-" + d.getFullYear() + " " + lead(d.getHours()) + ":" + lead(d.getMinutes()) + ":" + lead(d.getSeconds());
};

module.exports = {
    monitor: monitor,
    getProgramas: getProgramas,
    getAssignedPrograms: getAssignedPrograms,
    assign: assign,
    addPaso: addPaso,
    remove: remove,
    save: save,
    tieneProgramaActivo: tieneProgramaActivo,
    getLog: getLog
};