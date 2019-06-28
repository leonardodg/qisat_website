(function () {
	'use strict';

	angular
		.module('QiSatApp')
		.config(['vcRecaptchaServiceProvider', '__env', function (vcRecaptchaServiceProvider, env) {
			vcRecaptchaServiceProvider.setDefaults({
				key: env.google.recaptcha_v2,
				lang: 'pt-BR'
			});
		}]);

})();