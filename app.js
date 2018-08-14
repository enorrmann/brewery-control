const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');


// load default props on start
var defaults = fs.readFileSync('defaults.prop', 'utf8');
var maxArray = defaults.split(";");

var getMaxString = function(){
   return maxArray[0]+';'+maxArray[1]+';'+maxArray[2]+';'+maxArray[3]+';';
};

app.use(express.static('startmin'));

app.get('/', function(req, res) {
   res.sendfile('index.html');
});

io.on('connection', function(socket) {
   console.log('A user connected');

   setInterval(function() {
      var random1 = Math.floor(Math.random() * 30); 
      var random2 = Math.floor(Math.random() * 30); 
      var random3 = Math.floor(Math.random() * 30); 
      var random4 = Math.floor(Math.random() * 30); 

      var comp1 = random1>=maxArray[0] ? 1:0;
      var comp2 = random2>=maxArray[1] ? 1:0;
      var comp3 = random3>=maxArray[2] ? 1:0;
      var comp4 = random4>=maxArray[3] ? 1:0;

      var data = '0;'+getMaxString()+random1+';'+random2+';'+random3+';'+random4+';'+comp1+';'+comp2+';'+comp3+';'+comp4+';';
      socket.send(data);
   }, 3000);

   socket.on('setMax', function(data){
      maxArray[data.index] = data.valor;
      fs.writeFile('defaults.prop', getMaxString(), (err) => {
        if (err) throw err;
      });      
   });


});

http.listen(3000, function() {
   console.log('listening on *:3000');
});