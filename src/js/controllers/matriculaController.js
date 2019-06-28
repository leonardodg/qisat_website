(function () {
	'use strict';

	angular
		.module('QiSatApp')
		.controller('matriculaController', ['$scope', '$rootScope', '$window', 'authService', 'Authenticated', '$controller', '$filter', 'Config',
			function (scope, $rootScope, $window, authService, Authenticated, $controller, $filter, Config) {
				var filterLimitName = $filter('limitName');
				var modalController = $controller('modalController');

				$rootScope.loading = true;
				scope.user = authService.getUser();
				scope.title = "Cursos em Andamento";
				scope.agendados = false;
				scope.outros = false;
				scope.filterTab = 'liberado';

				scope.setFilterTab = function (val) {
					scope.filterTab = val;
				}

				scope.courseQuestion = function (curso) {

					authService.courseQuestion({
						wstoken: Config.tokens.moodleQuestion,
						moodlewsrestformat: "json",
						wsfunction: "web_service_questionnaire",
						courseid: curso.cursoid,
						type: "aula_favorita",
						userid: scope.user.id
					}).then(function (res) {

						var questionnaire;
						if (res && res.data && res.data.sucesso) {
							if (res.data.questionnaire) {
								questionnaire = JSON.parse(res.data.questionnaire);
								questionnaire.curso = curso.cursoid;
								questionnaire.url = curso.view;
								questionnaire.user = scope.user.id;
								modalController.questionnaire(questionnaire);
							} else {
								$window.location.href = curso.view;
							}
						} else {
							$window.location.href = curso.view;
						}
					}, function (res) {
						$window.location.href = curso.view;
					});
				};

				if (Authenticated) {

					authService.courses()
						.then(function (res) {
							scope.courses = [];
							if (res.matriculas) {
								scope.courses = res.matriculas;
								scope.courses.map(function (matricula) {
									var timestart, timeend, day, month, year, imagemFile, nomes;

									if (!matricula.imagem)
										matricula.imagem = Config.imagens.foundCourse;

									if (matricula.produto) {
										matricula.nome = matricula.produto.nome;
										matricula.nomeLimit = filterLimitName(matricula.produto.nome, 100);

										if (matricula.produto.capitulo) {
											nomes = matricula.curso.split(':');
											matricula.capNome = nomes[0];
											matricula.capNomeLimit = filterLimitName(matricula.capNome, 50);
											matricula.capitulo = "Capítulo " + matricula.produto.capitulo + ": ";
										}
									} else if (matricula.info) {
										matricula.nome = matricula.info.titulo;
										matricula.nomeLimit = filterLimitName(matricula.info.titulo, 100);
									} else if (matricula.curso) {
										matricula.nome = matricula.curso;
										matricula.nomeLimit = filterLimitName(matricula.curso, 100);
									}

									if (matricula.data_conclusao) {
										timeend = moment.unix(matricula.data_conclusao);
										if (timeend.isValid())
											matricula.msg = "Certificado em " + timeend.format('DD/MM/YYYY');

										if (moment.unix(matricula.timeend).isAfter()) {
											matricula.enable = true;
											matricula.filter = 'liberado';
										} else
											matricula.filter = 'finalizado';

									} else if (matricula.status == "Curso Agendado") {
										timestart = moment.unix(matricula.timestart);
										if (timestart.isValid())
											matricula.msg = " Data de Inicío " + timestart.format('DD/MM/YYYY');
										matricula.filter = 'agendado';
										if (!scope.agendados) scope.agendados = true;
									} else if (matricula.status == "Liberado para Acesso") {
										matricula.enable = true;

										if (matricula.timeend) {
											timeend = moment.unix(matricula.timeend);
											if (timeend.isValid())
												matricula.msg = "Expira em " + timeend.format('DD/MM/YYYY');
										}

										matricula.filter = 'liberado';
									} else if (matricula.status == "Prazo Encerrado") {
										matricula.filter = 'encerrado';
										if (matricula.timeend) {
											timestart = moment.unix(matricula.timestart);
											timeend = moment.unix(matricula.timeend);
											if (timeend.isValid() && timestart.isValid())
												matricula.msg = "Liberado " + timestart.format('DD/MM/YYYY') + " - Expirou em " + timeend.format('DD/MM/YYYY');
										}

									} else {
										matricula.filter = 'outros';
										if (!scope.outros) scope.outros = true;
									}

								});
							}
							$rootScope.loading = false;
						});
				}

			}]);
})();
