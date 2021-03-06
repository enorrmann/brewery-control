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

    $(".tacho0").html(dataArray[5] + '&deg;C');
    $(".tacho1").html(dataArray[6] + '&deg;C');
    $(".tacho2").html(dataArray[7] + '&deg;C');
    $(".tacho3").html(dataArray[8] + '&deg;C');

    var comp0 = dataArray[9];
    var comp1 = dataArray[10];
    var comp2 = dataArray[11];
    var comp3 = dataArray[12];

    setClasses(0, comp0);
    setClasses(1, comp1);
    setClasses(2, comp2);
    setClasses(3, comp3);

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