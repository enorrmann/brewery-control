const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
const db = require('./modules/simpleDb.js');

var SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
let port = null;
var connected = false;

// load default props on start
var defaults = fs.readFileSync('defaults.prop', 'utf8');
var maxArray = defaults.split(";");

var sendDefaults = function () {
    port.write('S1X0' + maxArray[0] + 'E');
    port.write('S2X0' + maxArray[1] + 'E');
    port.write('S3X0' + maxArray[2] + 'E');
    port.write('S4X0' + maxArray[3] + 'E');
};

var getMaxString = function () {
    return maxArray[0] + ';' + maxArray[1] + ';' + maxArray[2] + ';' + maxArray[3] + ';';
};

app.use(express.static('startmin'));

app.get('/', function (req, res) {
    res.sendfile('index.html');
});

var initPort = function (puerto) {
    var self = this;
    if (self.connected == true) {
        return;
    }
    port = new SerialPort(puerto, {
        baudRate: 9600
    });

    self.connected = true;
    port.on('close', function () {
        self.connected = false;
        self.port = null;

    });
    const parser = port.pipe(new Readline({delimiter: '\n'}));
    parser.on('data', function (data) {
        if (data[0] == 1) { // si se detecta un reinicio 
            sendDefaults(); // envio comandos de valores default
        }
        ;
        io.emit('message', data);
    });
};

io.on('connection', function (socket) {
    socket.on('setMax', function (data) {
        var codeindex = data.index + 1;
        if (port && port !== null) {
            port.write('S' + codeindex + 'X0' + data.valor + 'E');
        }
        maxArray[data.index] = data.valor;
        fs.writeFile('defaults.prop', getMaxString(), (err) => {
            if (err)
                throw err;
        });
    });


});

setInterval(function () {
    SerialPort.list(function (err, ports) {
        if (ports) {
            ports.forEach(function (each) {
                if (JSON.stringify(each).match(/.*duino.*/gi)) {
                    initPort(each.comName);
                }
                ;
            });
        }
    });
}, 1000);


/*setInterval(function () {
 var random = Math.floor(Math.random() * 6) + 1  ;
 db.save(random + " hola");
 }, 1000);*/

http.listen(3000, function () {
    console.log('listening on *:3000');
});