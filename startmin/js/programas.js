
var app = angular.module('myApp', ['ngResource']);
app.controller('programaCtrl', function ($scope, $resource) {

    $scope.seleccion = {};
    var getAssignedPrograms = function () {
        var url = $resource('assignedPrograms');
        return url.get().$promise;// es un solo objeto con propiedades por cada tacho
    };

    var getAllPrograms = function () {
        var url = $resource('programas');
        return url.query().$promise;
    };

    $scope.tachos = ['t1', 't2', 't3', 't4'];

    $scope.iniciarPrograma = function (tacho) {
        console.log("iniciando "+$scope.seleccion.programa.nombre + " en "+tacho);
    };

    getAllPrograms().then(function (programas) {
        $scope.programas = programas;
        $scope.seleccion.programa = programas[0];
    });

    getAssignedPrograms().then(function (assignedPrograms) {
        $scope.assignedPrograms = assignedPrograms;
    });


});