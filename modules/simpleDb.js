const fs = require('fs');

var stream = fs.createWriteStream("append.log", {flags: 'a'});

var lastData;
var _save = function (data) {
    if (lastData !== data){
        var time = new Date().getTime();
        stream.write(time+";"+data + "\n");    
        lastData = data;
    }
    
};

module.exports = {
    save: _save
};