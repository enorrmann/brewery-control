$(function () {
    var data = [];

    function generateData() {
        if (data.length >= 20) {
            data.shift();
        }
        var d = new Date();
        var n = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

        data.push({
            time: n,
            t1: Math.floor(Math.random() * 16) + 1,
            t2: Math.floor(Math.random() * 16) + 1,
            t3: Math.floor(Math.random() * 16) + 1
        });
        //return ret;
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
    function update() {
        generateData();
        graph.setData(data);
    }
    setInterval(update, 5000);



});
