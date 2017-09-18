	(function() {
    'use strict';

    	angular
			.module('QiSatApp')
			.config(['vcRecaptchaServiceProvider', function (vcRecaptchaServiceProvider) {
						vcRecaptchaServiceProvider.setDefaults({
						    key: '6Ld8bgcUAAAAAFeHx_7T3Vb_cBZTGDH_CZ_T_uhA',
						    lang: 'pt-BR'
						  });
					}]);

})();