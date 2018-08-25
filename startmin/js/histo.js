var socket = io();

var getItem = function (filename) {
    //var item = '<a href="#" class="list-group-item"><i class="fa fa-comment fa-fw"></i> New Comment<span class="pull-right text-muted small"><em>4 minutes ago</em></span></a>';
    return '<a href=/registros/' + filename + ' class="list-group-item"><i class="fa fa-comment fa-fw"></i> ' + filename + '<span class="pull-right text-muted small"><em>Descargar</em></span></a>';
};

var getStatus = function () {
    
    $.get("/status", function (response) {
        var divGrabando = '<div class="alert alert-danger" >Registrando historial en <a href="/'+response.currentFileName+'" class="alert-link">Este archivo</a>.</div>';
        var divGrabar = '<div class="alert alert-info" >Presione el boton para comenzar a registrar la actividad</div>';
        if (response.saving) {
            $('#alertRecording').html(divGrabando);
            $('#btnStartRecording').hide();
            $('#btnStopRecording').show();
        } else {
            $('#alertRecording').html(divGrabar);
            $('#btnStartRecording').show();
            $('#btnStopRecording').hide();
        }
    });
};
var refreshList = function () {

    $.get("/entries", function (myStringArray) {
        var arrayLength = myStringArray.length;
        var innerHtml = "";
        for (var i = 0; i < arrayLength; i++) {
            innerHtml += getItem(myStringArray[i]);
        }

        $('#registroList').html(innerHtml);
    });
};
var startRecording = function () {
    $.post("/startRecording", function (data) {
        refreshList();
        getStatus();
    });
};
var stopRecording = function () {
    $.post("/stopRecording", function (data) {
        getStatus();
    });
};
refreshList();
getStatus();

socket.on('message', function (data) {

    updateGraph(data);
});