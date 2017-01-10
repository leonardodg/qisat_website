(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.directive('playDemoModal', [ '$modal','$sce',function ($modal, $sce) {
	        return {
	            restrict: 'A',
	            scope: false,
	            controller: function () {
			 					this.modal = function(src){ 
				 								$modal.open({ 
		                      						windowClass: 'trailer',
						 							templateUrl: '/views/modal-trailer.html',
						 							controller : function ($scope, $modalInstance) {
																	  $scope.cancel = function () {
																	    $modalInstance.dismiss('cancel');
																	  };
																	  $scope.video = $sce.trustAsResourceUrl(src);
																	}
						 							});
						 						};
				 			  	},
	            link: function (scope, elem, attrs, ctrl) {
	            	if(attrs.playDemoModal)
	            		attrs.modal = ctrl.modal;
	            }
	        }
	    }]);
})();