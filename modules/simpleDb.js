const fs = require('fs');

var stream = fs.createWriteStream("append.log", {flags: 'a'});

var lastData;
var _save = function (data) {
    if (lastData !== data){
        stream.write(data + "\n");    
        lastData = data;
    } else {
        console.log('ya estaba '+data);
    }
    
};

module.exports = {
    save: _save
};