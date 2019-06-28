(function () {
	'use strict';

	angular
		.module('QiSatApp')
		.directive('pageBuy', ['$location', '$rootScope', function ($location, $rootScope) {
			return {
				restrict: 'A',
				link: function (scope, element) {
					var body = angular.element(document).find('body');

					function check(event) {
						if ($location.path() && ($location.path().indexOf('/carrinho') == 0) || $location.path().indexOf('/proposta') == 0)
							body.addClass('cart-page');
						else if (body.hasClass('cart-page'))
							body.removeClass('cart-page');
					}

					$rootScope.$on('$viewContentLoaded', check);
				}
			}
		}]);
})();