var asJson = function (sensorData) {
    var dataArray = sensorData.split(" ").join("").split(";");
    // Definimos la cantidad de registros
    const cant_tachos = 8;
    const numRegistros = cant_tachos;

    // 1 registro de estado + 4 datos de limites seteados  + 4 lecturas de sensores  + 4 estados de compresor activo   + 1 elemento vacio luego del ultimo ;

    var largo_trama_esperado = (cant_tachos * 3) + 2;

    if (dataArray.length != largo_trama_esperado) {
        console.log("valor trama esperado difiere");
        console.log(dataArray.length);
        console.log(largo_trama_esperado);
        return
        {
            status: 2
        };
    }

    const newData = {
        status: dataArray[0]
    };


    // Agregar propiedades m1-m8
    for (let i = 1; i <= numRegistros; i++) {
        newData[`m${i}`] = dataArray[i] || null;
    }

    // Agregar propiedades t1-t8
    for (let i = 1; i <= numRegistros; i++) {
        newData[`t${i}`] = dataArray[i + numRegistros] || null;
    }

    // Agregar propiedades compresor1-compresor8
    for (let i = 1; i <= numRegistros; i++) {
        newData[`compresor${i}`] = dataArray[i + (2 * numRegistros)] || null;
    }

    return newData;
};


module.exports = {
    asJson: asJson
};