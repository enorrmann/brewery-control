var getItem = function (filename) {
    //var item = '<a href="#" class="list-group-item"><i class="fa fa-comment fa-fw"></i> New Comment<span class="pull-right text-muted small"><em>4 minutes ago</em></span></a>';
    return '<a href=/registros/' + filename + ' class="list-group-item"><i class="fa fa-comment fa-fw"></i> ' + filename + '<span class="pull-right text-muted small"><em>Descargar</em></span></a>';
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
    });
};
var stopRecording = function () {
    $.post("/stopRecording", function (data) {
        console.log("stop");
    });
};

refreshList();