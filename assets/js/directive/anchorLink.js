(function () {
  "use strict";

  angular
  	.module('QiSatApp')
  	.directive('anchorLink', 
			['$location', '$anchorScroll', function($location,$anchorScroll) {
				return {
					restrict: 'A',
					link: function(scope, $elm, attrs) {
							$elm.on('click', function(event) {
								var anchor = attrs.href;
								if(anchor){
									event.preventDefault();
									anchor = anchor.replace('#', '');
									$location.hash(anchor);
									$anchorScroll();	
									// return false;
								}
							});
					}
			}
  		}]);

  
}());