(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('certificadoController', ['$scope', '$location','$sce', '$document', '$filter','authService','Authenticated', 'certificados',
					 function(scope, $location, $sce, $document, $filter, authService, Authenticated, certificados ) {

					 	if(authService.isLogged() && Authenticated){
					 		scope.user = authService.getUser();
					 		scope.user.nome = scope.user.firstname+' '+scope.user.lastname;
					 	}

					 	if(certificados){
					 		console.log(certificados['return']);
					 		certificados['return'].map(function(certificado){
					 			certificado.datasolicitacaoFormat = $filter('date')( certificado.datasolicitacao*1000, 'dd/MM/yyyy' );
					 			certificado.timestartFormat = $filter('date')( certificado.timestart*1000, 'dd/MM/yyyy' );
					 			if(certificado.digital)
					 				certificado.link = certificados.links.digital;
					 			else
					 				certificado.link = certificados.links.default;
					 			
					 		});
					 		scope.certificados = certificados;
					 	}

					 	scope.linkCertify = function(link) {
						    return $sce.trustAsResourceUrl(link);
						};

					 }]);
})();