
var app = angular.module('myApp', ['ngResource']);
app.controller('programaCtrl', function ($scope, $resource) {

    $scope.seleccion = {};
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

    $scope.tachos = ['t1', 't2', 't3', 't4'];

    $scope.iniciarPrograma = function (tacho) {
        var data = {
            tacho: tacho,
            programa: $scope.seleccion.programa

        };
        assign(data).then(function (data) {
            init();
        });
    };

    $scope.quitarPrograma = function (tacho) {
        remove(tacho).then(function (data) {
            init();
        });
    };
    
    $scope.seleccionar = function(programa){
        $scope.seleccion.programa = programa;
    };


    var init = function () {
        getAllPrograms().then(function (programas) {
            $scope.programas = programas;
            $scope.seleccion.programa = programas[0];
        });
        getAssignedPrograms().then(function (assignedPrograms) {
            $scope.assignedPrograms = assignedPrograms;
        });
    };
    init();



});