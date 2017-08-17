(function() {
	'use strict';

	angular
		.module('QiSatApp')
		.controller('confirmarCadastroController', [ '$scope', '$controller', '$location', '$analytics', 'authService',
			function(scope, $controller, $location, $analytics, authService ) {

				var modalController = $controller('modalController');
				$analytics.pageTrack($location.path());

				scope.status = 'form';

				scope.solicitarEmail = function(credentials) {
					scope.status = 'loading';
					authService.solicitarEmail(credentials).then(function (res){
						if((res.status == 200)&&(res && res.data && res.data.retorno)){
							scope.status = res.data.retorno.status;
							//modalController.alert({ main : { title : "", subtitle : res.data.retorno.mensagem } });
							window.setInterval(function() {
								if(scope.status == 'cadastre-se') {
									window.location = '/cadastro';
								} else if (scope.status == 'confirmado'){
									window.location = '/login';
								}
							}, 7000);

						}
						return res;
					}, function(){ scope.loading = false; modalController.alert(); });
				};
				/** Retornos **
				 cadastre-se
				 confirmado
				 enviado
				 erro
				-------------
				 valido
				 expirado
				 invalido
				 */
				scope.confirmarCadastro = function(credentials) {
					scope.status = 'loading';
					authService.confirmarCadastro(credentials).then(function (res){
						if((res.status == 200)&&(res && res.data && res.data.retorno)){
							scope.status = res.data.retorno.status;
							//modalController.alert({ main : { title : "", subtitle : res.data.retorno.mensagem } });
							window.setInterval(function() {
								if(scope.status == 'valido' || scope.status == 'confirmado') {
									window.location = '/login';
								}
							}, 7000);
						}
						return res;
					}, function(){ scope.loading = false; modalController.alert(); });
				};

				var token = $location.path().replace("/confirmar-cadastro", "").replace("/", "");
				if(token != ""){
					scope.status = 'loading';
					var credentials = {token : token};
					scope.confirmarCadastro(credentials);
				} else {
					var email = window.localStorage.getItem('email');
					if(email != null){
						scope.status = 'loading';
						var credentials = {username : email};
						scope.solicitarEmail(credentials);
					}
				}

				window.localStorage.removeItem('email');
			}]);
})();
