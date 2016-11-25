(function () {
  "use strict";

  var directive = function(){
		    return function(scope, element, attrs){
		        var url = attrs.backImg;
		        element.css({
		            'background-image' : 'url("' + url +'")'
		        });
		    };
		};

  angular
  	.module('QiSatApp')
  	.directive('backImg', directive);
  
}());