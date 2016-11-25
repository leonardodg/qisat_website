(function() {
    'use strict';

	angular
		.module('loginTeste', [])
		.controller('loginController', ['$http', '$scope', function($http, scope ) {

					 scope.login = function(){
			        	return $http({ 
                                      method: 'POST', 
                                      url: 'http://localhost:3000/user/login',
                                      data: {  "username" : "leodg", "password" : "l30dg231987", "teste" : "true" },
                                      withCredentials : true
                            

                                            }).then(function (res){
			          							console.log(res);
			          							return res;
			          						});
			        };

			}]);
})();