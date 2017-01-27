(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.directive('menuCarrinhoActive', ['$location', function ($location) {
	        return {
	            restrict: 'A',
	            link: function (scope, element) {
	            	
	                function setActive() {
	                    var path = $location.path(), elem = element.find('.step');
	                	if(elem) elem.removeClass('active');
	                    if (path) {
	                    	if(path == '/carrinho'){
	                    		elem = element.find('.step1');
	                    	}else if(path == '/carrinho/pagamento' || path == '/carrinho/pagamento/'){
	                    		elem = element.find('.step1,.step2');
	                    	}else if(path == '/carrinho/confirmacao' || path == '/carrinho/confirmacao/'){
	                    		elem = element.find('.step');
	                    	}

	                        if(elem) elem.addClass('active');
	                    }
	                };

	                scope.$on('$locationChangeSuccess', setActive);
	            }
	        }
	    }]);
})();