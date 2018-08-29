const express = require('express');

const passport = require('passport');
const Strategy = require('passport-local').Strategy;

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
const logger = require('./modules/simpleDb.js');
const db = require('./users');
var path = require('path');

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

//app.use(express.static('startmin'));
app.use('/registros', express.static('registros'));

app.get('/status',
        require('connect-ensure-login').ensureLoggedIn(),
        function (req, res) {
            res.status(200).send(logger.getStatus());
        });


app.post('/startRecording', function (req, res) {
    logger.startRecording();
    res.status(200).send();
});

app.post('/stopRecording', function (req, res) {
    logger.stopRecording();
    res.status(200).send();
});

app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname, './startmin/pages', 'login.html'));
});

app.get('/*.js', function (req, res) {
    res.sendFile(path.join(__dirname, './startmin', req.url));
});
app.get('/*.css', function (req, res) {
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

app.post('/login',
        passport.authenticate('local', {failureRedirect: '/login'}),
        function (req, res) {
            res.redirect('/');
        });


app.get('/registros/*.csv', function (req, res) {
    res.sendFile(req.url);
});
app.get('/entries', function (req, res) {
    logger.listEntries(function (error, items) {
        res.status(200).send(items);
    });
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
        logger.save(data);
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

// test zone
/*
 setInterval(function () {
 var random = Math.floor(Math.random() * 16) + 1;
 logger.save(random + " hola");
 }, 100);
 
 logger.startRecording();
 
 setInterval(function () {
 logger.endRecording();
 logger.startRecording();
 }, 20000);
 */

http.listen(3000, function () {
    console.log('listening on *:3000');
});