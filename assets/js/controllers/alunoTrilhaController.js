(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('alunoTrilhaController', [ '$scope',  'authService',
					 function( scope, authService) {

					 	var vm = this;

					 	vm.abaProjeto = 'estrutural';
					 	vm.abaConteudo = 'sobre'; 

					 	vm.setConteudo = function (value) {
					 		vm.abaConteudo = value;
					 	}

					 	vm.setProjeto = function (value) {
					 		vm.abaProjeto = value;
					 	}

					 }]);
})();
