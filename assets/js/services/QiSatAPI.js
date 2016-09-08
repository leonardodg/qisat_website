var QiSatApp = angular.module('QiSatApp');

QiSatApp.factory("QiSatAPI", function($http, Config){

	var _getInstructorsTop = function () {
		return $http({ cache: true, method: 'GET', url: Config.baseUrl+'/instrutores/top'});
	};

	var _getCoursesTop = function () {
		return $http({ cache: true, method: 'GET', url: Config.baseUrl+'/moodle/produtos/top'});
	};

	var _getCourses = function () {
		return $http({ cache: true, method: 'GET', url: Config.baseUrl+'/moodle/produtos'});
	};

	var _getStates = function () {
		return $http({ cache: true, method: 'GET', url: Config.baseUrl+'/moodle/eventos/estados'});
	};

	var _getFilterData = function () {
		return $http({ cache: true, method: 'GET', url: Config.baseUrl+'/moodle/tipo/dados'});
	};


	return {
		getInstructorsTop : _getInstructorsTop,
		getCoursesTop : _getCoursesTop,
		getCourses : _getCourses,
		getStates : _getStates,
		getFilterData : _getFilterData
	};
});