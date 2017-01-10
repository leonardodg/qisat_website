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

						var videosDemo = [
									   		"https://www.youtube.com/embed/fOrGTKQJqHU",
									   		"https://www.youtube.com/embed/VBPKeNidHco"
									   		];


						activate();

					 	vm.modaltrailer = function () {
				 					var modalInstance = $modal.open({ 
                      						windowClass: 'trailer',
				 							templateUrl: '/views/modal-trailer.html',
				 							controller : function ($scope, $modalInstance) {
															  $scope.cancel = function () {
															    $modalInstance.dismiss('cancel');
															  };
															  $scope.video = $sce.trustAsResourceUrl(videosDemo[0]);
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
											 			// REFAZER
											 			info.conteudos[0].demoplay = videosDemo[0]; // TEMPORARIO
											 			info.conteudos[0].dataValor = { valor : "R$500,00", valorReal : "R$700,00", data : "Até 10/01/2017", produto : 1};

											 			info.conteudos.map(function (conteudo){
											 				conteudo.descricao = $sce.trustAsHtml(conteudo.descricao);
											 			});
											 		}

											 		if(info.instrutores && info.instrutores.length){
											 			info.instrutores.map(function(instrutor){
											 				instrutor.descricao = $sce.trustAsHtml(instrutor.descricao);
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