(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('certificadoController', ['$scope','$sce', '$filter','authService','Authenticated', 'certificados',
					 function(scope, $sce, $filter, authService, Authenticated, certificados ) {

					 	if(authService.isLogged() && Authenticated){
					 		scope.user = authService.getUser();
					 		scope.user.nome = scope.user.firstname+' '+scope.user.lastname;
					 	}

					 	if(certificados){
					 		certificados.map(function(certificado){
					 			certificado.datasolicitacaoFormat = $filter('date')( certificado.datasolicitacao*1000, 'dd/MM/yyyy' );
					 			certificado.timestartFormat = $filter('date')( certificado.timestart*1000, 'dd/MM/yyyy' );
					 			if(certificado.digital)
					 				certificado.link = certificado.links.digital;
					 			else
					 				certificado.link = certificado.links.default;
					 			
					 		});
					 		scope.certificados = certificados;
					 	}

					 	scope.linkCertify = function(link) {
						    return $sce.trustAsResourceUrl(link);
						};

					 }]);
})();
