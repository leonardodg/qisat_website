(function() {
    'use strict';

    	angular
			.module('QiSatApp')
			.config(['$httpProvider', function ($httpProvider) {
					    $httpProvider.defaults.withCredentials = true;
					}]);

})();