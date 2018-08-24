const fs = require('fs');

var stream = null;

var lastData;
var lastSaveTime = 0;
var saving = false;

var _save = function (data) {
    if (!saving) {
        return;
    }
    var time = new Date().getTime();
    if (lastData !== data && (time - lastSaveTime) > 10000) { // intervalo minimo entre eventos de guardado, por ejemplo 10 segundos
        stream.write(getTimeString(time) + ";" + data + "\n");
        lastData = data;
        lastSaveTime = time;
    }

};

var getTimeString = function (milis) {
    var d = new Date(milis);
    return d.getDay() + "-" + d.getMonth() + "-" + d.getFullYear() + " " + lead(d.getHours()) + ":" + lead(d.getMinutes()) + ":" + lead(d.getSeconds());
};

var getFilename = function (d) {
    var d = new Date();
    return "registros/registro_" + d.getDay() + "_" + d.getMonth() + "_" + d.getFullYear() + "_" + lead(d.getHours()) + "_" + lead(d.getMinutes()) + "_" + lead(d.getSeconds()) + ".csv";
};

var lead = function (number) {
    return (number < 10) ? "0" + number : number;
};

var _startRecording = function () {
    if (!saving) {
        saving = true;
        var filename = getFilename();
        stream = fs.createWriteStream(filename, {flags: 'a'});
    }
};

var _stopRecording = function () {
    if (saving) {
        stream.end();
        saving = false;
    }
};

var _listEntries = function (f) {
    fs.readdir("registros", f);
};

module.exports = {
    save: _save,
    startRecording: _startRecording,
    stopRecording: _stopRecording,
    listEntries: _listEntries
};