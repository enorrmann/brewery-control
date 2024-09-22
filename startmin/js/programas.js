
var app = angular.module('myApp', ['ngResource']);
app.controller('programaCtrl', function ($scope, $resource, $interval) {

    $scope.seleccion = {};
    $scope.editandoReceta = false;
    $scope.assignedPrograms = {};
    $scope.editStart = function () {
        $scope.editandoReceta = true;
    };

    var addPaso = function (tacho, paso, idx) {
        var url = $resource('assignedPrograms/:id/paso');
        paso.idx = idx;
        return url.save({id: tacho}, paso).$promise;
    };

    var powerDown = function () {
        var url = $resource('system/powerdown');
        return url.save().$promise;
    };

    var updatePaso = function (tacho, paso, idPaso) {
        var url = $resource('assignedPrograms/:tacho/paso/:idPaso');
        paso.idPaso = idPaso;
        return url.save({tacho: tacho, idPaso: idPaso}, paso).$promise;
    };

    var checkStepStates = function () {
        var keys = Object.keys($scope.assignedPrograms);
        keys.forEach(function (key) {
            if ($scope.assignedPrograms[key].pasos) {
                setStepState($scope.assignedPrograms[key]);
            }
        });
    };

    var setStepState = function (programa) {
        var now = new Date().getTime();
        var pasos = programa.pasos;
        for (var i = 0; i < pasos.length; i++) {
            if (pasos[i].endTime < now) {
                pasos[i].state = 'success';
            } else if (pasos[i].startTime <= now && pasos[i].endTime >= now) {
                pasos[i].state = 'info';
            }
        }
    };

    $scope.guardar = function () {
        $scope.editandoReceta = false;
        saveAll();
    };

    $scope.addUnDia = function (paso, tacho, idPaso) {
        paso.dias++;
        updatePaso(tacho, paso, idPaso).then(function (data) {
            init();
        });
    };

    $scope.removeUnDia = function (paso, tacho, idPaso) {
        if (paso.dias == 1) {
            return;
        }
        paso.dias--;
        updatePaso(tacho, paso, idPaso).then(function (data) {
            init();
        });
    };
    $scope.repetir = function (paso, tacho, idx) {
        addPaso(tacho, paso, idx).then(function (data) {
            init();
        });
    };

    $scope.eliminarPaso = function (idx) {
        $scope.seleccion.programa.pasos.splice(idx, 1);
    };

    $scope.eliminarPrograma = function (idx) {
        $scope.programas.splice(idx, 1);
        $scope.seleccion.programa = $scope.programas[0];
        saveAll();
    };

    $scope.nuevoPrograma = function () {
        var nuevoPrograma = {
            nombre: 'Nuevo programa',
            pasos: [{}]
        };
        if (!$scope.programas){
            $scope.programas = [];
        };
        $scope.programas.push(nuevoPrograma);
        $scope.seleccion.programa = nuevoPrograma;

        $scope.editStart();
    };

    var getAssignedPrograms = function () {
        var url = $resource('assignedPrograms');
        return url.get().$promise;// es un solo objeto con propiedades por cada tacho
    };

    var assign = function (programaTacho) {
        var url = $resource('assignedPrograms');
        return url.save({}, programaTacho).$promise;
    };

    var remove = function (tacho) {
        var url = $resource('assignedPrograms/:id');
        return url.delete({id: tacho}).$promise;
    };

    var getAllPrograms = function () {
        var url = $resource('programas');
        return url.query().$promise;
    };

    var getLog = function (fermentador) {
        var url = '/registro/' + fermentador;
        window.open(url, '_blank');
    };

    var saveAll = function () {
        var url = $resource('programas');
        return url.save({}, $scope.programas).$promise;
    };

    $scope.tachos = ['t1', 't2', 't3', 't4','t5', 't6', 't7', 't8' ] ;


    $scope.apagarSistema = function () {
        powerDown();
    };

    $scope.iniciarPrograma = function (tacho) {
        var data = {
            tacho: tacho,
            programa: $scope.seleccion.programa

        };
        assign(data).then(function (data) {
            init();
        });
    };

    $scope.quitarPrograma = function () {
        remove($scope.fermentadorSeleccionado).then(function (data) {
            init();
        });
    };

    $scope.descargarRegistro = function (fermentador) {
        getLog(fermentador);
    };

    $scope.seleccionarFermetador = function (fermentador) {
        $scope.fermentadorSeleccionado = fermentador;

    };
    $scope.seleccionar = function (programa) {
        $scope.editandoReceta = false;
        $scope.seleccion.programa = programa;
    };
  
  $scope.agregarPaso = function () {
        $scope.seleccion.programa.pasos.push({});
    };

    var init = function () {
        getAllPrograms().then(function (programas) {
            $scope.programas = programas;
            $scope.seleccion.programa = programas[0];
        });
        getAssignedPrograms().then(function (assignedPrograms) {
            $scope.assignedPrograms = assignedPrograms;
            checkStepStates();
        });
    };
    init();


    $interval(
            checkStepStates, 60000 // chequear el estado cada un minuto
            );



});