(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.directive('menuCarrinhoActive', ['$location', '$rootScope', function ($location, $rootScope) {
	        return {
	            restrict: 'A',
	            link: function (scope, element) {
	                
	                function setActive() {
	                    var path = $location.path(), elem = element.find('.step');
	                	if(elem) elem.removeClass('active');

						var patt = new RegExp("\/carrinho\/\d*");
						if(path == '/carrinho' || patt.test(path))
                    		elem = element.find('.step1');
                    	else if(path == '/carrinho/pagamento')
                    		elem = element.find('.step1,.step2');

                        if(elem) elem.addClass('active');
	                };

	                setActive();
	            }
	        }
	    }]);
})();