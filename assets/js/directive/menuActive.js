(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.directive('menuActive', ['$location', function ($location) {
	        return {
	            restrict: 'A',
	            link: function (scope, element) {
	            	
	                function setActive() {
	                    var path = $location.path(), elem,
	                    	active = element.find('.menu-horizontal__item--current'),
	                    	elems = element.find('a.menu-horizontal__link');

	                    	if(active.length)
	                    		active.removeClass('menu-horizontal__item--current');

	                    if (path) {
	                         angular.forEach(elems, function (el){
	                        	if(el && el.href.indexOf(path) > 0)
	                        		elem = el;
	                        });

	                        if(elem){
	                        	elem = angular.element(elem).parent();
	                        	if(elem) elem.addClass('menu-horizontal__item--current');
	                        }
	                    }
	                }

	                scope.$on('$locationChangeSuccess', setActive);
	            }
	        }
	    }]);
})();