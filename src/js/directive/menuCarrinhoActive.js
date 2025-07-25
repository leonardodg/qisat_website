(function () {
	'use strict';

	angular
		.module('QiSatApp')
		.directive('menuCarrinhoActive', ['$location', '$rootScope', function ($location, $rootScope) {
			return {
				restrict: 'A',
				link: function (scope, element) {

					function setActive() {
						var path = $location.path(), elem = element.find('.step');
						if (elem) elem.removeClass('active');

						if (path == '/carrinho' || path.indexOf('/proposta') >= 0 || (path.indexOf('/renovacao') >= 0 && path.indexOf('pagamento') < 0 && path.indexOf('confirmacao') < 0) )
							elem = element.find('.step1');
						else if ((path == '/carrinho/pagamento') || (path == '/renovacao-licencas-altoqi/pagamento'))
							elem = element.find('.step1,.step2');

						if (elem) elem.addClass('active');
					}

					setActive();
				}
			}
		}]);
})();