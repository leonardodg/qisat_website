(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.directive('tabSubMenuLab', function () {
	        return {
	            restrict: 'A',
	            link: function (scope, element) {
		                var elemts = element.find('li');

		                elemts.on('click', function (event){
		                	var el = element.find('li.menu-horizontal__item--current');
		                	if(el) el.removeClass('menu-horizontal__item--current');
		                	el = angular.element(this);
		                	el.addClass('menu-horizontal__item--current');
		                });
	            }
	        }
	    });
})();