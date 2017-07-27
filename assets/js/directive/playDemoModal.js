(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.directive('playDemoModal', [ '$modal','$sce', '$controller', '$window' ,function ($modal, $sce, $controller, $window) {
	        return {
	            restrict: 'A',
	            scope: false,
	            controller: function () {
    				var modalController = $controller('modalController');
    				// this.modal = modalController.trailer;
    				this.modal = function(link){
						$window.open(link, "popup", "width=1014,height=667");
					};
				},
	            link: function (scope, elem, attrs, ctrl) {
	            	if(attrs.playDemoModal)
	            		attrs.modal = ctrl.modal;
	            }
	        }
	    }]);
})();