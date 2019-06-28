(function () {
	'use strict';

	angular
		.module('QiSatApp')
		.config(['$httpProvider', '__env', function ($httpProvider, env) {

			loading.$inject = ['$q'];
			function loading($q) {
				var body = angular.element(document).find('body');

				return {
					request: function (config) {
						if (config.loading) {
							body.addClass('wait');
						}

						return config;
					},

					response: function (response) {
						if (response && response.config && response.config.loading) {
							body.removeClass('wait');
						}

						return response;
					},

					responseError: function (rejection) {
						if (rejection && rejection.config && rejection.config.loading) {
							body.removeClass('wait');
						}

						return $q.reject(rejection);
					}
				};
			}

			function postmon() {
				return {
					request: function (config) {

						var regex = /api.postmon.com.br/i;
						if (regex.test(config.url))
							delete config.headers.Authorization;

						return config;
					}
				};
			}

			function moodle() {
				return {
					request: function (config) {

						var url = config.url;
						url = url.replace(/(http:\/\/|https:\/\/)/gi, "");
						var regex = new RegExp(env.url.plataforma, "i");

						if (regex.test(url)) {
							delete config.headers.Authorization;
						}

						return config;
					}
				};
			}

			$httpProvider.interceptors.push(postmon);
			$httpProvider.interceptors.push(moodle);
			$httpProvider.interceptors.push(loading);

		}]);

}());