const fs = require('fs');

var stream = null;

var lastData;
var lastSaveTime = 0;
var saving = false;
var currentFileName = "";

var writeEncabezados = function () {
    stream.write("fecha,reinicio,max1,max2,max3,max4,temp1,temp2,temp3,temp4,comp1,comp2,comp3,comp4\n");
};
var _save = function (data) {
    if (!saving) {
        return;
    }
    var time = new Date().getTime();
    if (lastData !== data && (time - lastSaveTime) > 10000) { // intervalo minimo entre eventos de guardado, por ejemplo 10 segundos
        var toSave = getTimeString(time) + ";" + data + "\n";
        toSave = toSave.split(';').join(',');
        stream.write(toSave);
        lastData = data;
        lastSaveTime = time;
    }

};

var getTimeString = function (milis) {
    var d = new Date(milis);
    return lead(d.getDate()) + "-" + lead(d.getMonth()+1) + "-" + d.getFullYear() + " " + lead(d.getHours()) + ":" + lead(d.getMinutes()) + ":" + lead(d.getSeconds());
};

var getFilename = function (d) {
    var d = new Date();
    return "registros/registro_" + lead(d.getDate()) + "_" + lead(d.getMonth()+1) + "_" + d.getFullYear() + "_" + lead(d.getHours()) + "_" + lead(d.getMinutes()) + "_" + lead(d.getSeconds()) + ".csv";
};

var lead = function (number) {
    return (number < 10) ? "0" + number : number;
};

var _startRecording = function () {
    if (!saving) {
        saving = true;
        var filename = getFilename();
        currentFileName = filename;
        stream = fs.createWriteStream(filename, {flags: 'a'});
        writeEncabezados();
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

var _getStatus = function () {
    return {
        currentFileName: currentFileName,
        saving: saving
    };
};

module.exports = {
    save: _save,
    startRecording: _startRecording,
    stopRecording: _stopRecording,
    getStatus: _getStatus,
    listEntries: _listEntries
};