var asJson = function (sensorData) {
    var dataArray = sensorData.split(" ").join("").split(";");
    
    var newData = {}
    if (dataArray.length != 14){
        newData =
            {
                status: 2
            }
    } else {
        newData =
            {
                status: dataArray[0],
                m1: dataArray[1],
                m2: dataArray[2],
                m3: dataArray[3],
                m4: dataArray[4],
                t1: dataArray[5],
                t2: dataArray[6],
                t3: dataArray[7],
                t4: dataArray[8]
            };

    }
    return newData;
};
module.exports = {
    asJson: asJson
};