(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.directive('menuActive', ['$location', '$rootScope', function ($location, $rootScope) {
	        return {
	            restrict: 'A',
	            link: function (scope, element) {

	                function setActive() {
	                    var path = $location.path(), pos, elem,
	                    	elems = element.find('li.header-main__list'),
	                    	active = elems.find('a.header-main__list-current');

                    	if(active.length)
                    		active.removeClass('header-main__list-current');

                    	active = elems.find('a.header-main__list-item-current');
                    	if(active.length)
                    		active.removeClass('header-main__list-item-current');

	                    if (path) {
	                    	if(path == '/')
	                    		pos = 0;
	                    	else if(path.indexOf('/curso') == 0)
	                    		pos = 1
	                    	else if(path.indexOf('/institucional') == 0 )
	                    		pos = 3;
	                    	else if(path == '/login' || path == '/lembrete-de-senha' || path == '/cadastro' || path.indexOf('/aluno') == 0)
	                    		pos = 2

	                        if(pos >= 0) 
	                        	elem = angular.element(elems[pos]);

	                        if(elem){
	                        	elem.find('a').addClass('header-main__list-current');
	                        	elem.find('a').addClass('header-main__list-item-current');
	                        }
	                    }
	                };
	                
	                $rootScope.$on('$viewContentLoaded', setActive);
	            }
	        }
	    }]);
})();