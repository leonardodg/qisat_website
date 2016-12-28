(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('infoController', ['$scope','$sce', '$location', '$filter', 'QiSatAPI', '$modal',
					 function(scope, $sce, $location, $filter, QiSatAPI, $modal) {
					 	var vm = this, 
					 		absUrl = $location.absUrl(), 
					 		host = $location.host(), 
					 		path = absUrl.substr(absUrl.indexOf('curso/'));
					 		path = path.split('/');

					 	vm.modaltrailer = function () {
				 					var modalInstance = $modal.open({ 
                      windowClass: 'trailer',
				 							templateUrl: '/views/modal-trailer.html',
				 							controller : function ($scope, $modalInstance) {
															  $scope.cancel = function () {
															    $modalInstance.dismiss('cancel');
															  };
															}
				 						});
					 			  };

					 	vm.modalcall = function () {
				 					var modalInstance = $modal.open({ 
                      windowClass: 'call',
				 							templateUrl: '/views/modal-call.html',
				 							controller : function ($scope, $modalInstance) {
															  $scope.cancel = function () {
															    $modalInstance.dismiss('cancel');
															  };
															}
				 						});
					 			  };

    					activate();

						function activate() {
					         return QiSatAPI.getInfo(path[2])
					                        .then(function(info){
					                        	console.log(info);
					                       		if(info){
					                            	info.descricao = $sce.trustAsHtml(info.descricao);
					                            	info.persona = $sce.trustAsHtml(info.persona);

					                            	if(info.faqs && info.faqs.length){
					                            		info.faqs.map(function(faq){
											 				return faq.descricao = $sce.trustAsHtml(faq.descricao);
											 			});
					                            	}

													if(info.files && info.files.length){
											 			info.imgtop = info.files.find(function(img){
											 				return img.tipo == "3";
											 			});

											 			info.imgdemo = info.files.filter(function(img){
											 				return img.tipo == "6";
											 			});
											 		}

											 		if(info.conteudos && info.conteudos.length){
											 			info.conteudos.map(function (conteudo){
											 				conteudo.descricao = $sce.trustAsHtml(conteudo.descricao);
											 			});
											 		}

											 		if(info.produto)
										 				info.valor = $filter('currency')(info.produto.preco, 'R$ ');
						 		
						                       		vm.info = info;
						                       	}
					                            return info;
					                        });
				        };
		 }])
		.run(function($rootScope, $location, $anchorScroll) {
			    $rootScope.$on('$locationChangeSuccess', function (event, newUrl, oldUrl) {
			    	if($location.hash()) 
			    		$anchorScroll();
			    });
		});

})();