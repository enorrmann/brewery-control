
var app = angular.module('myApp', []);
app.controller('recetaCtrl', function ($scope) {
    $scope.seleccionar = function(receta){
        $scope.recetaSeleccionada = receta;
    };
    $scope.recetas = ['Centenario: clara',
        'Pilsener: rubia',
        'Red Lager: roja',
        'Porter: negra'];


});

