(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('certificadoController', ['$rootScope','$scope','$sce',  '$window', '$filter','authService','Authenticated', 'Config',
					 function($rootScope, scope, $sce, $window, $filter, authService, Authenticated, Config ) {

					 	if(Authenticated){
						 	$rootScope.loading = true;
					 		scope.user = authService.getUser();
					 		scope.user.nome = scope.user.firstname+' '+scope.user.lastname;
                      		authService.certificados()
                      				   .then(function (res){
                      				   			if(res.data && res.data.retorno.sucesso){
                      				   				scope.certificados = res.data.retorno.certificado; 
											 		scope.certificados.map(function(certificado){
											 			certificado.datasolicitacaoFormat = $filter('date')( certificado.datasolicitacao*1000, 'dd/MM/yyyy' );
											 			certificado.timestartFormat = $filter('date')( certificado.timestart*1000, 'dd/MM/yyyy' );
											 			if(certificado.links)
												 			if(certificado.digital)
												 				certificado.link = certificado.links.digital;
												 			else
												 				certificado.link = certificado.links.default;

												 		if(!certificado.imagem)
												 			certificado.imagem = Config.imgCursoUrlDefault;
												 			
											 		});
                      				   			}
						 						$rootScope.loading = false;
                      				   		});
					 	}

					 	scope.linkCertify = function(link) {
						    $window.open(link);
						};

					 }]);
})();
