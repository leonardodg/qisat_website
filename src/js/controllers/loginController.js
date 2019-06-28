(function () {
	'use strict';

	angular
		.module('QiSatApp')
		.controller('loginController', ['$scope', '$controller', '$location', 'authService',
			function (scope, $controller, $location, authService) {

				var modalController = $controller('modalController');
				scope.loading = false;
				scope.altoqi = false;

				scope.fnAltoQi = function () {
					scope.altoqi = !scope.altoqi;
				};

				scope.remember_me = true;
				scope.login = function (credentials) {
					scope.loading = true;

					if (scope.loginForm && scope.loginForm.$valid) {
						scope.error = false;
						credentials.username = credentials.username.replace(/^\s+|\s+$/g, "");
						credentials.password = credentials.password.replace(/^\s+|\s+$/g, "");
						credentials.remember = (scope.remember_me) ? true : false;
						credentials.altoqi = (scope.altoqi) ? true : false;

						if (credentials.altoqi) {
							if (credentials.username.indexOf("@") < 0) {
								credentials.username = credentials.username.replace(/[^0-9]+/g, "");
								credentials.digito = credentials.username.substr(6);
								credentials.username = credentials.username.substr(0, 6);
							}
						}

						authService.login(credentials).then(function (res) {
							var url;
							if ((res.status == 200) && (res && res.data && res.data.retorno && res.data.retorno.sucesso)) {
								url = authService.getRedirect();
								if (url) {
									if (typeof url == "object") {
										if ("path" in url)
											$location.path(url.path);
										if ("search" in url)
											$location.search(url.search);
									} else
										$location.path(url);
								} else {
									$location.path('/aluno');
								}

							} else if ((res.status == 200) && (res && res.data && res.data.retorno && res.data.retorno.erro == "nao-confirmado")) {
								modalController.alert({ error: true, main: { title: "Cadastro não confirmado!", subtitle: "Favor validar seu Email" } });
								$location.path('/confirmar-cadastro');
								scope.loading = false;
							} else if ((res.status == 200) && (res && res.data && res.data.retorno && res.data.retorno.erro == "nao-autorizado")) {
								modalController.alert({ error: true, main: { title: "Autenticação não autorizado!", subtitle: "Usuário/Email ou Senha inválida." } });
								scope.loading = false;
							} else {
								modalController.alert({ error: true, main: { title: "Falha na Autenticação!" } });
								scope.loading = false;
							}

						}, function () { scope.loading = false; modalController.alert({ error: true }); });
					} else {
						scope.error = true;
						scope.loading = false;
					}

				};
			}]);
})();
