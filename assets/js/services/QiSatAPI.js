var QiSatApp = angular.module('QiSatApp');

QiSatApp.factory("QiSatAPI", function($http, Config){

	var _getInstructorsTop = function () {
		return $http({ method: 'GET', url: Config.baseUrl+'/instrutores/top'});
	};

	return {
		getInstructorsTop : _getInstructorsTop
	};
});