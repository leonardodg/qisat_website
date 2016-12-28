(function () {
  "use strict";

  var directive = function(){
		    return function(scope, element, attrs){
		        var url = attrs.backImg;
		        if(!url){
		        	attrs.$observe('backImg', function (val) {
		        		if(val) element.css({ 'background-image' : 'url("' + val +'")' });
	                });
		        }
		        element.css({ 'background-image' : 'url("' + url +'")' });
		    };
		};

  angular
  	.module('QiSatApp')
  	.directive('backImg', directive);
  
}());