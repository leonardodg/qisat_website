(function () {
	"use strict";

	angular
		.module('QiSatApp')
		.directive('chaveAltoqi', ['$timeout', function (timer) {
			return {
				restrict: 'A',
				require: "ngModel",

				link: function (scope, element, attrs, ctrl) {

					var _formataCodigo = function (codigo) {
						// Verifica se o usuario digitou o login por codigo de cliente e não por email
						if (codigo.indexOf("@") < 0) {
							codigo = codigo.replace(/[^0-9]+/g, "");
							if (codigo.length >= 7) {
								codigo = codigo.substring(0, 6) + "-" + codigo.substring(6, 7);
							} else if (codigo.length === 6) {
								codigo = "0" + codigo.substring(0, 5) + "-" + codigo.substring(5, 6);
							}
						}
						return codigo;
					}

					element.bind("blur", function () {

						if (attrs.chaveAltoqi === 'true') {
							ctrl.$setViewValue(_formataCodigo(ctrl.$viewValue));
						} else {
							ctrl.$setViewValue(ctrl.$viewValue);
						}

						ctrl.$render();
						scope.$apply();
					});
				}
			}
		}]);
}());