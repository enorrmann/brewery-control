const express = require('express');

const passport = require('passport');
const Strategy = require('passport-local').Strategy;

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
var propertiesFile = process.env.HOME + "/.config/brewery-control/defaults.prop";
const db = require('./users');
const program = require('./modules/program.js');
var myEvents = require('./modules/myEvents.js');
var json2xls = require('json2xls');

const shell = require('shelljs');

myEvents.on("adjust", function (data) {
    var codTacho = data.tacho.replace('t', 'S');
    var maximo = data.value;
    var codigoAEnviar = codTacho + 'X0' + maximo + 'E';
    if (port && port !== null) {
        port.write(codigoAEnviar);
    }

});

var path = require('path');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(json2xls.middleware);


passport.use(new Strategy(
        function (username, password, cb) {
            db.users.findByUsername(username, function (err, user) {
                if (err) {
                    return cb(err);
                }
                if (!user) {
                    return cb(null, false);
                }
                if (user.password != password) {
                    return cb(null, false);
                }
                return cb(null, user);
            });
        }));

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    db.users.findById(id, function (err, user) {
        if (err) {
            return cb(err);
        }
        cb(null, user);
    });
});

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('express-session')({secret: 'keyboard cat', resave: false, saveUninitialized: false}));

app.use(passport.initialize());
app.use(passport.session());


var SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
let port = null;
var connected = false;

// load default props on start
var defaults = fs.readFileSync(propertiesFile, 'utf8');
var maxArray = defaults.split(";");

var sendDefaults = function () {
    if (!program.tieneProgramaActivo('t1')) {
        port.write('S1X0' + maxArray[0] + 'E');
    }
    if (!program.tieneProgramaActivo('t2')) {
        port.write('S2X0' + maxArray[1] + 'E');
    }
    if (!program.tieneProgramaActivo('t3')) {
        port.write('S3X0' + maxArray[2] + 'E');
    }
    if (!program.tieneProgramaActivo('t4')) {
        port.write('S4X0' + maxArray[3] + 'E');
    }
};

var getMaxString = function () {
    return maxArray[0] + ';' + maxArray[1] + ';' + maxArray[2] + ';' + maxArray[3] + ';';
};

app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname, './startmin/pages', 'login.html'));
});

app.get('/*.js', function (req, res) {
    res.sendFile(path.join(__dirname, './startmin', req.url));
});
app.get('/*.css', function (req, res) {
    res.sendFile(path.join(__dirname, './startmin', req.url));
});
app.get('/*.woff*', function (req, res) {
    res.sendFile(path.join(__dirname, './startmin', req.url));
});
app.get('/*.html',
        require('connect-ensure-login').ensureLoggedIn(),
        function (req, res) {
            res.sendFile(path.join(__dirname, './startmin/pages', req.url));
        });

app.get('/',
        require('connect-ensure-login').ensureLoggedIn(),
        function (req, res) {
            res.sendFile(path.join(__dirname, './startmin/pages', 'index.html'));
        });

app.post('/system/powerdown',
        require('connect-ensure-login').ensureLoggedIn(),
        function (req, res) {
            res.status(200).send();
            //shell.exec('sudo /sbin/shutdown -h now');
            shell.exec('sudo /sbin/reboot');
        });

app.post('/login',
        passport.authenticate('local', {failureRedirect: '/login'}),
        function (req, res) {
            res.redirect('/');
        });


app.get('/programas', function (req, res) {
    res.status(200).send(program.getProgramas());
});
app.post('/programas', function (req, res) {
    res.status(200).send(program.save(req.body));
});

app.get('/assignedPrograms', function (req, res) {
    res.status(200).send(program.getAssignedPrograms());
});
app.post('/assignedPrograms', function (req, res) {
    res.status(200).send(program.assign(req.body));
});

app.delete('/assignedPrograms/:tacho', function (req, res) {
    res.status(200).send(program.remove(req.params.tacho));
});

app.post('/assignedPrograms/:tacho/paso', function (req, res) {
    var paso = req.body;
    res.status(200).send(program.addPaso(req.params.tacho, paso));
});

app.post('/assignedPrograms/:tacho/paso/:idPaso', function (req, res) {
    var paso = req.body;
    res.status(200).send(program.updatePaso(req.params.tacho, paso));
});

app.get('/registro/:fermentador', function (req, res) {
    var fnum = req.params.fermentador;
    res.xls('registro_' + fnum + '.xlsx', program.getLog(fnum));
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
        program.monitor(data);
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
        fs.writeFile(propertiesFile, getMaxString(), (err) => {
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


http.listen(3000);
 