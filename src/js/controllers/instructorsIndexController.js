(function () {
	'use strict';

	angular
		.module('QiSatApp')
		.controller("instructorsIndexController",
			['$scope', 'Config', 'QiSatAPI', '$filter', function (scope, Config, QiSatAPI, $filter) {
				var filterLimitName = $filter('nameInstructor');
				QiSatAPI.getInstructorsTop()
					.then(function (response) {
						var instructors = [];
						if (response.status == 200 && response.data.retorno) instructors = response.data.retorno;


						instructors.map(function (instructor) {
							if (instructor) {

								instructor.nome = filterLimitName(instructor.nome);
								instructor.formacao = filterLimitName(instructor.formacao);

								if (instructor.redes_sociais && instructor.redes_sociais.length) {
									instructor.linkedin = instructor.redes_sociais.find(function (el) {
										return el && el.descricao == 'Linkedin';
									});
								}
							}

						});
						scope.instructors = instructors;
					});
			}]);
})();
