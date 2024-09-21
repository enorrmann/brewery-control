var socket = io();

var setMax = function (idx) {
    var valor = $('#input' + idx).val();
    var intVal = Number(valor);
    if (Number.isInteger(intVal) && intVal > 0) {
        socket.emit('setMax', {index: idx, valor: intVal});
        $(".maxtacho" + idx).html(valor);
    }
    $('#input' + idx).val('');


};

var setClasses = function (index, status) {
    if (status == 1) {
        $('#panelTacho' + index).addClass('panel-red').removeClass('panel-green');
        $('#thermo' + index).addClass('fa-thermometer-full').removeClass('fa-thermometer-half');
    } else {
        $('#panelTacho' + index).addClass('panel-green').removeClass('panel-red');
        $('#thermo' + index).addClass('fa-thermometer-half').removeClass('fa-thermometer-full');
    }

};

socket.on('disconnect', () => {
    $('#mensajeDesconectado').show();
});
socket.on('connect', () => {
    $('#mensajeDesconectado').hide();
});

socket.on('message', function (data) {
    $('#mensajeEsperandoArduino').hide();
    var dataArray = data.split(";");

    $(".maxtacho0").html(dataArray[1]);
    $(".maxtacho1").html(dataArray[2]);
    $(".maxtacho2").html(dataArray[3]);
    $(".maxtacho3").html(dataArray[4]);
    $(".maxtacho4").html(dataArray[5]);
    $(".maxtacho5").html(dataArray[6]);
    $(".maxtacho6").html(dataArray[7]);
    $(".maxtacho7").html(dataArray[8]);

    $(".tacho0").html(dataArray[9] + '&deg;C');
    $(".tacho1").html(dataArray[10] + '&deg;C');
    $(".tacho2").html(dataArray[11] + '&deg;C');
    $(".tacho3").html(dataArray[12] + '&deg;C');
    $(".tacho4").html(dataArray[13] + '&deg;C');
    $(".tacho5").html(dataArray[14] + '&deg;C');
    $(".tacho6").html(dataArray[15] + '&deg;C');
    $(".tacho7").html(dataArray[16] + '&deg;C');

    var comp0 = dataArray[17];
    var comp1 = dataArray[18];
    var comp2 = dataArray[19];
    var comp3 = dataArray[20];
    var comp4 = dataArray[21];
    var comp5 = dataArray[22];
    var comp6 = dataArray[23];
    var comp7 = dataArray[24];

    setClasses(0, comp0);
    setClasses(1, comp1);
    setClasses(2, comp2);
    setClasses(3, comp3);
    setClasses(4, comp4);
    setClasses(5, comp5);
    setClasses(6, comp6);
    setClasses(7, comp7);

});

var deshabilitar = function (fermentadorKey) {
    var index = fermentadorKey.replace("t", "");
    index--; //empieza de cero
    $("#input" + index).prop('placeholder', "Limite controlado por un programa");
    $("#input" + index).prop('disabled', true);
};


var checkRunningPrograms = function () {
    $.get("/assignedPrograms", function (runningPrograms) {
        var fs = Object.keys(runningPrograms);
        fs.forEach(function (fermentador) {
            deshabilitar(fermentador);
        });
    });
};

// A $( document ).ready() block.
$(document).ready(function () {
    checkRunningPrograms();
});