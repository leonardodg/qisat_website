(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.directive('menuAlunoCursos', function () {
	        return {
	            restrict: 'A',
	            link: function (scope, element) {
		                var elemts = element.find('li');

		                elemts.on('click', function (event){
		                	var el = element.find('li.current'), title = angular.element('.title');
		                	el.removeClass('current');
		                	el = angular.element(this);
		                	title.text(el.text());
		                	el.addClass('current');
		                });
	            }
	        }
	    });
})();