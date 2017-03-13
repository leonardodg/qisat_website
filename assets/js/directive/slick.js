(function () {
  "use strict";

  angular
  	.module('QiSatApp')
  	.directive('slick', [ '$timeout', function(timer) {
				return {
					restrict: 'A',
					link: function(scope, elem, attrs) {
                            var init = function(){
			                    elem.slick({ 
			                    	vertical : true, 
			                    	slidesToShow: 10, 
			                    	slidesToScroll: 10,
			                    	infinite: false,
			                    	prevArrow : '<i class="material-icons" class="slick-prev">expand_less</i>',
			                    	nextArrow : '<i class="material-icons" class="slick-next">expand_more</i>'
			                    });
			                };
			                timer(init, 0);
					}
			}
  		}]);
}());