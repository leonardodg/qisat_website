(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.directive('playDemoModal', [ '$modal','$sce', '$controller' ,function ($modal, $sce, $controller) {
	        return {
	            restrict: 'A',
	            scope: false,
	            controller: function () {
    				var modalController = $controller('modalController');
    				this.modal = modalController.trailer;
				},
	            link: function (scope, elem, attrs, ctrl) {
	            	if(attrs.playDemoModal)
	            		attrs.modal = ctrl.modal;
	            }
	        }
	    }]);
})();