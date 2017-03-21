(function () {
  "use strict";

  angular
  	.module('QiSatApp')
  	.directive('anchorLink', 
			['$window', '$document', '$location', '$anchorScroll', function($window, $document, $location, $anchorScroll) {
				return {
					restrict: 'A',
					link: function(scope, $elm, attrs) {
							$elm.on('click', function(event) {
								var anchor = attrs.href, cont, el, elementTop, h, pos;

								if(anchor && anchor.indexOf('#') == 0){
									event.preventDefault();
									cont = angular.element($window);
								    el = angular.element( anchor );

									if(el.length){
									     h = el.height() / 3;
									     elementTop = el.position().top;
									     pos = cont.scrollTop() + elementTop + h;

								        angular.element('html, body').animate({
								          scrollTop: pos
								        }, 1000);
									}else{
										$location.hash(anchor);
    									$anchorScroll();
									}
								}
							});
					}
			}
  		}]);

  
}());