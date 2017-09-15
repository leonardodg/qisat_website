	(function() {
    'use strict';

    	angular
			.module('QiSatApp')
			.config(['vcRecaptchaServiceProvider', function (vcRecaptchaServiceProvider) {
						vcRecaptchaServiceProvider.setDefaults({
						    key: '----TOKEN-----',
						    lang: 'pt-BR'
						  });
					}]);

})();