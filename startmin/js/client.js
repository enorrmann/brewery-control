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

    console.log("trama");
    console.log(data);

    $(".maxtacho0").html(dataArray[1]);
    $(".maxtacho1").html(dataArray[2]);
    $(".maxtacho2").html(dataArray[3]);
    $(".maxtacho3").html(dataArray[4]);
    $(".maxtacho4").html(dataArray[5]);
    $(".maxtacho5").html(dataArray[6]);

    $(".tacho0").html(dataArray[7] + '&deg;C');
    $(".tacho1").html(dataArray[8] + '&deg;C');
    $(".tacho2").html(dataArray[9] + '&deg;C');
    $(".tacho3").html(dataArray[10] + '&deg;C');
    $(".tacho4").html(dataArray[11] + '&deg;C');
    $(".tacho5").html(dataArray[12] + '&deg;C');

    var comp0 = dataArray[13];
    var comp1 = dataArray[14];
    var comp2 = dataArray[15];
    var comp3 = dataArray[16];
    var comp4 = dataArray[17];
    var comp5 = dataArray[18];

    setClasses(0, comp0);
    setClasses(1, comp1);
    setClasses(2, comp2);
    setClasses(3, comp3);
    setClasses(4, comp4);
    setClasses(5, comp5);

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