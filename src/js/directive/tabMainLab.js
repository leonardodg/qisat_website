(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.directive('tabMainLab', function () {
	        return {
	            restrict: 'A',
	            link: function (scope, element) {
		                var elemts = element.find('li'), sub = angular.element('.lab-submenu_container ul.menu-horizontal__list');

		                elemts.on('click', function (event){
		                	var el = element.find('li.menu-horizontal__item--current');
		                	var subEl = sub.find('li.menu-horizontal__item--current');

		                	if(el) el.removeClass('menu-horizontal__item--current');
		                	if(subEl) subEl.removeClass('menu-horizontal__item--current');

		                	el = angular.element(this);
		                	subEl = sub.find('li.menu-horizontal__item:first-child');

		                	el.addClass('menu-horizontal__item--current');
		                	subEl.addClass('menu-horizontal__item--current');
		                });
	            }
	        }
	    });
})();