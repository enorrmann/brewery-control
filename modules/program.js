var programa1 = [
    {
        paso: "primer paso",
        duracion: 10000
    },
    {
        paso: "segundo paso",
        duracion: 4000
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
    var now = new Date().getTime();
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

var checkTime = function () {
    var step = getCurrentStep(programa1);
    console.log(step);
};

var run = function () {
    setTimes(programa1);
    setInterval(checkTime, 1000);
};


module.exports = {
    run: run
};