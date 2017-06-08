(function() {
    'use strict';

    	angular
			.module('QiSatApp')
			.config(['$compileProvider', function ($compileProvider) {
					  $compileProvider.debugInfoEnabled(false);
					}]);

})();