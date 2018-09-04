var data = [];
var lastSaveTime = 0;
function pushData(newData) {

    if (data.length >= 20) {
        data.shift();
    }

    data.push(newData);
    graph.setData(data);

}

var graph = Morris.Area({
    element: 'morris-area-chart',
    data: data,
    xkey: 'time',
    ykeys: ['t1', 't2', 't3', 't4'],
    labels: ['t1', 't2', 't3', 't4'],
    xLabels: 'time',
    parseTime: false,
    hideHover: true
});
function updateGraph(csvData) {

    var dataArray = csvData.split(";");
    var d = new Date();
    if (d - lastSaveTime <= 10000) { // si no pasaron 10 segundos aun
        return;
    }
    lastSaveTime = d;

    var n = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    var newData = 
    {
        time: n,
        m1 : dataArray[1],
        m2 : dataArray[2],
        m3 : dataArray[3],
        m4 : dataArray[4],
        t1 : dataArray[5],
        t2 : dataArray[6],
        t3 : dataArray[7],
        t4 : dataArray[8]
    };
    pushData(newData);
}
