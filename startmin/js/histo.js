var socket = io();

var setMax = function (idx) {
    var valor = $('#input' + idx).val();
    socket.emit('setMax', {index: idx, valor: valor});
    $(".maxtacho" + idx).html(valor);
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

    $(".tacho0").html(dataArray[5] + '&deg');
    $(".tacho1").html(dataArray[6] + '&deg');
    $(".tacho2").html(dataArray[7] + '&deg');
    $(".tacho3").html(dataArray[8] + '&deg');

    var comp0 = dataArray[9];
    var comp1 = dataArray[10];
    var comp2 = dataArray[11];
    var comp3 = dataArray[12];

    setClasses(0, comp0);
    setClasses(1, comp1);
    setClasses(2, comp2);
    setClasses(3, comp3);

});