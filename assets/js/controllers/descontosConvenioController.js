(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller("descontosConvenioController", 
					[ '$scope','$filter','descontosConvenio', function($scope,$filter, descontosConvenio){
						var filterLimitName = $filter('limitName');

						if(descontosConvenio){
							descontosConvenio.cursosSoftware.map(function(course){
								course.nomeLimit = filterLimitName(course.nome, 50);
								course.preco = $filter('currency')(course.preco, 'R$');
								course.valorAluno = $filter('currency')(course.valorAluno, 'R$');
								course.valorAssociado = $filter('currency')(course.valorAssociado, 'R$');
								course.valorProfessor = $filter('currency')(course.valorProfessor, 'R$');
								course.valorCREAs = $filter('currency')(course.valorCREAs, 'R$');
							});
							descontosConvenio.cursosTeoricos.map(function(course){
								course.nomeLimit = filterLimitName(course.nome, 50);
								course.preco = $filter('currency')(course.preco, 'R$');
								course.valorAluno = $filter('currency')(course.valorAluno, 'R$');
								course.valorAssociado = $filter('currency')(course.valorAssociado, 'R$');
								course.valorProfessor = $filter('currency')(course.valorProfessor, 'R$');
								course.valorCREAs = $filter('currency')(course.valorCREAs, 'R$');
							});
							descontosConvenio.cursosSoftware.sort(function (a, b) {
								if (a.nome > b.nome)
									return 1;
								if (a.nome < b.nome)
									return -1;
								return 0;
							});
							descontosConvenio.cursosTeoricos.sort(function (a, b) {
								if (a.nome > b.nome)
									return 1;
								if (a.nome < b.nome)
									return -1;
								return 0;
							});

							$scope.cursosSoftware = descontosConvenio.cursosSoftware;
							$scope.cursosTeoricos = descontosConvenio.cursosTeoricos;
						}
			}]);
})();
