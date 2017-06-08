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

	                    	if(path == '/institucional/parceiros' || path == '/institucional/parceiros/' || path.indexOf('/institucional/convenios') >=0 )
	                    		path = '/institucional/convenios-e-parceiros';
	                    	else if( path.indexOf('/institucional/instrutor') >=0 )
	                    		path = '/institucional/instrutores-e-professores';
	                    	else if(path == '/institucional/' || path == '/institucional')
	                    		path = '/institucional/sobre-a-empresa';

	                         angular.forEach(elems, function (el){
	                         		 el = angular.element(el);
	                         		 var link = el.attr('link');
	                        		 if(el && ((path == link) || (path.indexOf(link) >= 0)))
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