(function () {
	'use strict';

	angular
		.module('QiSatApp')
		.controller("contactController",
			['$scope', 'QiSatAPI', '$modal', '$controller', 'vcRecaptchaService', 'authService',
				function ($scope, QiSatAPI, $modal, $controller, vcRecaptchaService, authService) {

					var modalController = $controller('modalController');
					$scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,6}$/;
					$scope.modalcall = modalController.call;
					$scope.showZopim = modalController.showZopim;
					$scope.submitted = false;
					$scope.isDisabled = true;

					// Codigo Recaptcha
					$scope.responseRecaptcha = null;
					$scope.widgetId = null;
					$scope.setResponse = function (responseRecaptcha) {
						$scope.responseRecaptcha = responseRecaptcha;
					};
					$scope.setWidgetId = function (widgetId) {
						$scope.widgetId = widgetId;
					};
					$scope.reloadRecaptcha = function () {
						vcRecaptchaService.reload($scope.widgetId);
						$scope.responseRecaptcha = null;
					};


					$scope.addNew = function () {
						var user = authService.getUser();

						$scope.submitted = true;
						if ($scope.emailNew) {
							$scope.isDisabled = false;
							QiSatAPI.newsletter($scope.emailNew).then(function (res) {
								$scope.submitted = false;
								$scope.isDisabled = true;
								delete ($scope.emailNew);
								$scope.newForm.$setPristine();

								if (res && res.data && res.data.retorno && res.data.retorno.sucesso)
									modalController.alert({ success: true, main: { title: "Obrigado! Seu e-mail foi cadastrado.", subtitle: "A equipe QiSat manterá você informado sobre novidades." } });
								else
									modalController.alert({ error: true, main: { title: res.data.retorno.mensagem, subtitle: "Favor, tente novamente ou entre em contato conosco pelo telefone (48) 3332-5000." } });
							});
						}
					};

					$scope.sendMail = function () {
						var user = authService.getUser();
						var dados = { empresa: "QiSat", origem: "Site QiSat", categoria: "Mensagem Contato" };

						if (user)
							dados.userid = user.id;

						$scope.submitted = true;
						if ($scope.contatoForm.$valid) {

							dados.user_dados = {
								nome: $scope.contato.name,
								email: $scope.contato.email,
								telefone: $scope.contato.phone,
								subject: $scope.contato.subject,
								msg: $scope.contato.msg
							};

							dados.recaptcha = $scope.gRecaptchaResponse;

							QiSatAPI.newRepasse(dados)
								.then(function (res) {
									$scope.contato = {};
									$scope.submitted = false;
									$scope.reloadRecaptcha();
									$scope.contatoForm.$setPristine();

									if (res && res.data && res.data.retorno && res.data.retorno.sucesso)
										modalController.alert({ success: true, main: { title: "Obrigado! Sua mensagem foi enviada.", subtitle: "Em breve a equipe QiSat entrará em contato." } });
									else
										modalController.alert({ error: true, main: { title: "Falha no envio do E-mail!" } });

								}, function (res) {
									modalController.alert({ error: true });
								});
						} else
							modalController.alert({ error: true, main: { title: "Verifique os dados Solicitados!" } });
					};
				}]);
})();