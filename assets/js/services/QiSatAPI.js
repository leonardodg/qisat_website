var QiSatApp = angular.module('QiSatApp');

QiSatApp.factory("QiSatAPI", function($http, Config){

	var _getInstructorsTop = function () {
		return $http({ method: 'GET', url: Config.baseUrl+'/instrutores/top'});
	};

	var _getCoursesTop = function () {
		return $http({ method: 'GET', url: Config.baseUrl+'/moodle/produtos/top'});
	};

	return {
		getInstructorsTop : _getInstructorsTop,
		getCoursesTop : _getCoursesTop
	};
});