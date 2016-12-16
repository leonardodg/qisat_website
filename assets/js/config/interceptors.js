(function() {
    'use strict';

    	angular
			.module('QiSatApp')
			.config(['$httpProvider', function ($httpProvider) {
				
  						 function QiSatInterceptor($q) {
						        return {
						            request: function (config) {
						            	
										var regex = /api.postmon.com.br/i;
										   if(regex.test(config.url))
										    delete config.headers.Authorization;
										
						                return config;
						            }
						        };
						    }

						$httpProvider.interceptors.push(QiSatInterceptor);
					}]);

})();