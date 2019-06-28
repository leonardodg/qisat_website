(function () {
	'use strict';

	angular
		.module('QiSatApp')
		.config(['$analyticsProvider', '__env', function ($analyticsProvider, env) {

			$analyticsProvider.settings.ga.additionalAccountNames = env.google.ga;
			
			if (env.environment != 'production') {
				$analyticsProvider.developerMode(true);
			}

		}]);

})();