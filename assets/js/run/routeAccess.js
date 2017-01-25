(function() {
   'use strict';

	angular.module('QiSatApp')
		   .run(['$rootScope', '$location', '$route' ,'authService', 
				    function ($rootScope, $location, $route, authService ) {

						$rootScope.$on('$routeChangeStart', function(e, curr, prev) {
							console.log('routeChangeStart');
							$rootScope.error = '';
							if (curr && curr.$$route && !curr.$$route.isAuth && authService.isLogged() && ($location.path().indexOf('lembrete-de-senha') < 0)) {
								window.location = '/aluno/cursos';
							}else if (curr && curr.$$route && curr.$$route.isAuth && !authService.getToken()) {
								window.location = '/login';
							}
						});

						$rootScope.$on('$routeChangeSuccess', function(e, curr, prev) {
							console.log('routeChangeSuccess');
							if (curr && curr.$$route && curr.$$route.isAuth && !authService.isAuth() ){
								$rootScope.error = "Acesso Restrito!";
								window.location = '/login';
							}
						});

			    }]);
		   
}());