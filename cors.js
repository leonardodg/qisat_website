(function() {
    'use strict';

	angular
		.module('corsTeste', [])
		// .config(['$httpProvider', function($httpProvider) {
		// 	        $httpProvider.defaults.useXDomain = true;
		// 	        delete $httpProvider.defaults.headers.common['X-Requested-With'];
		// 	}])
		.controller('corsController', ['$http', '$scope', function($http, scope ) {


					 scope.getCEP = function(cep){
			        	return $http({ 
			          							method: 'GET',
			          							url: 'http://api.postmon.com.br/cep/'+cep,
						                        cache: false,
						                        dataType: 'jsonp',
						                        headers: {
						                            'Content-Type': 'application/JSON'
						                          }
			                        
			          						}).then(function(res){
			          							console.log(res.data);
			          						});
			        };

			}]);
})();