	(function() {
    'use strict';

    	angular
			.module('QiSatApp')
			.config(['$httpProvider', function ($httpProvider) {

					        function loading() {
					        	var body = angular.element(document).find('body');

								return {
									   'request': function(config) {
							                if ( config.loading )
							                	 body.addClass('wait');

							                return config;
									    },

									    'response': function(response) {
									    	if ( response && response.config && response.config.loading )
									    		body.removeClass('wait');

									      	return response;
									    },

								};
							};


	  						function postmon() {
							        return {
							            request: function (config) {
							            	
											var regex = /api.postmon.com.br/i;
											   if(regex.test(config.url))
											    delete config.headers.Authorization;
											
							                return config;
							            }
							        };
							};

							$httpProvider.interceptors.push(postmon);
   							$httpProvider.interceptors.push(loading);

					}]);

})();