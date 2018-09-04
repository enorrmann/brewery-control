const adapter = require('./sensorAdapter.js');

var programa1 = [
    {
        paso: "primer paso",
        duracion: 10000,
        temperatura: 15
    },
    {
        paso: "segundo paso",
        duracion: 4000,
        temperatura: 18
    },
    {
        paso: "tercer paso",
        duracion: 14000,
        temperatura: 23
    }
];

var getCurrentStep = function (programa) {
    var now = new Date().getTime();
    var curSetp = null;
    for (var i = 0; i < programa.length; i++) {
        if (programa[i].startTime <= now && programa[i].endTime >= now) {
            curSetp = programa[i];
        }
    }
    return curSetp;

};

var setTimes = function (programa) {
    var now = new Date().getTime() + 5000;//empeza dentro de 5 segundos
    for (var i = 0; i < programa.length; i++) {
        if (i === 0) {
            programa[i].startTime = now;
            programa[i].endTime = programa[i].duracion + now;
        } else {
            programa[i].startTime = programa[i - 1].endTime + 1;// +1 de changui
            programa[i].endTime = programa[i].startTime + programa[i].duracion;
        }

    }
};

var run = function () {
    setTimes(programa1);
    setInterval(sendFakeData, 1000);
};

var sendFakeData = function(){
    monitor("0;23;24;25;26;23;24;25;26;0;0;0;0;");
};

var monitor = function (sensorData) {
    var jsonData = adapter.asJson(sensorData);
    var step = getCurrentStep(programa1);
    if (step!=null && jsonData.m1 != step.temperatura){
        console.log(step.paso);
        console.log("step.temperatura "+step.temperatura);
        console.log("jsonData.m1 "+jsonData.m1);
        
        console.log("ajusto temperatura");
        
    } else {
        console.log("nada...");
    }
    // 1. ver si hay algun programa corriendo para cada tacho
    // 2. si hay programa, obtener paso actual del programa
    // 3. si la temperatura maxima del tacho es diferente a la del programa -> ajustar
    // para la prueba asumo que programa1 esta corriendo para el tacho1
};


module.exports = {
    run: run,
    monitor: monitor
};