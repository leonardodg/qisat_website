(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('perfilController', ['$scope', '$location', 'QiSatAPI', 'authService','Authenticated', 'postmon', 'Config',
					 function(scope, $location, QiSatAPI, authService, Authenticated, postmon, Config ) {

					 	function resetMSG(){
					 		delete(scope.typeMsgEdit);
					 		delete(scope.msgEdit);
					 		delete(scope.typeMsgEditPass);
					 		delete(scope.msgEditPass);
					 		delete(scope.typeMsgEditConfirm);
					 		delete(scope.msgEditConfirm);
					 	}

					 	function init() {
						 		resetMSG();
						 		scope.confirm = false;
							 	scope.checkPassword = false;
							 	scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,6}$/;
							 	scope.country = Config.country;
							 	scope.states = Config.states;

						 		if(authService.isLogged() && Authenticated){
							 		scope.user = angular.copy(authService.getUser());
							 		scope.user.cpfcnpj = scope.user.numero;
							 		scope.endereco = scope.user.endereco;

							 		if(scope.endereco.pais) 
							 			scope.endereco.selectCountry = scope.country.find(function(country){ return country.sigla == scope.endereco.pais });
							 		else 
							 			scope.endereco.selectCountry = { sigla : 'BR', pais : 'Brasil' };

							 		if(scope.endereco.estado) 
							 			scope.endereco.selectStates = scope.states.find(function(state){ return state.uf == scope.endereco.estado });

							 		if(!scope.user.email) scope.notEmail = false;
							 		else scope.notEmail = true;
							 		if(!scope.user.cpfcnpj) scope.notCPF = false;
							 		else {
							 			scope.user.cpfcnpj = scope.user.cpfcnpj.replace(/[^\d]+/g,'');
							 			scope.notCPF = true;
							 		}

							 		if(scope.user.endereco.cep) 
							 			scope.user.endereco.cep = scope.user.endereco.cep.replace(/[^\d]+/g,'');

							 		if(scope.user.phone1) 
							 			scope.user.phone1 = scope.user.phone1.replace(/[^\d]+/g,'');
						 		}
					 	}

					 	scope.buscaCEP = function(cep){
					 		postmon.getCEP(cep).then(function(data){
					 			if(data){
						 			scope.endereco = data;
						 			scope.endereco.selectStates = States.find(function(state){ return data.estado == state.uf });
						 			scope.endereco.selectCountry = { sigla : 'BR', pais : 'Brasil' };
						 		}
					 			return data;
					 		});
					 	}

					 	scope.enableInputs = function(){
					 			scope.checkPassword = true;
					 	}

					 	scope.fileUpdate = function(){
						 		resetMSG();
						 		scope.typeMsgEdit = "alert-box alert radius";
						 		scope.msgEdit = "Acão não implementada!";
					 	}

					 	scope.update = function(){
						 		var user = authService.getUser();
						 		var newdata = {}, aux;
						 			resetMSG();

						 		if(scope.user.firstname && scope.user.firstname !== user.firstname)
						 			newdata.firstname = scope.user.firstname;

						 		if(scope.user.lastname && scope.user.lastname !== user.lastname)
						 			newdata.lastname = scope.user.lastname;

						 		if(scope.user.email && !scope.notEmail && scope.user.email !== user.email)
						 			newdata.email = scope.user.email;

						 		if(scope.user.cpfcnpj && !scope.notCPF && scope.user.cpfcnpj !== user.cpfcnpj.replace(/\D/g,"")){
						 				aux = scope.user.cpfcnpj;
						 				if(aux.length == 11){
						 					if(!user.tipousuario || (user.tipousuario && user.tipousuario !== 'fisico')){ 
									 			newdata.tipousuario = 'fisico';
									 		}

						 					aux = aux.replace( /(\d{3})(\d)/ , "$1.$2"); 
										    aux = aux.replace( /(\d{3})(\d)/ , "$1.$2"); 
										    aux = aux.replace( /(\d{3})(\d{1,2})$/ , "$1-$2");
						 				}else{
						 					if(!user.tipousuario || (user.tipousuario && user.tipousuario !== 'juridico')){ 
									 			newdata.tipousuario = 'juridico';
									 		}

										    aux = aux.replace( /^(\d{2})(\d)/ , "$1.$2"); 
										    aux = aux.replace( /^(\d{2})\.(\d{3})(\d)/ , "$1.$2.$3"); 
										    aux = aux.replace( /\.(\d{3})(\d)/ , ".$1/$2");
										    aux = aux.replace( /(\d{4})(\d)/ , "$1-$2");
										}
										newdata.numero = aux;
						 		}

						 		if(scope.user['numero_crea'] && scope.user['numero_crea'] !== user['numero_crea'])
						 			newdata['numero_crea'] = scope.user['numero_crea'];

						 		if(scope.user.phone1 && scope.user.phone1 !== user.phone1.replace(/\D/g,"") ){
						 			aux = scope.user.phone1;
						 			aux = aux.replace(/^(\d{2})(\d)/g,"($1)$2");
						 			if(aux.length <= 10)
						 				aux = aux.replace(/(\d)(\d{5})$/,"$1-$2"); 
						 			else
						 				aux = aux.replace(/(\d)(\d{4})$/,"$1-$2"); 
						 			newdata.phone1 = aux;
						 		}

						 		if(scope.endereco){
							 		if(scope.endereco.logradouro && scope.endereco.logradouro !== user.endereco.logradouro)
							 			newdata.address = scope.endereco.logradouro;

							 		if(scope.endereco.numero && scope.endereco.numero !== user.endereco.numero)
							 			newdata.number = scope.endereco.numero;
							 		
							 		if(scope.endereco.complemento && scope.endereco.complemento !== user.endereco.complemento)
							 			newdata.complement = scope.endereco.complemento;

							 		if(scope.endereco.bairro && scope.endereco.bairro !== user.endereco.bairro)
							 			newdata.district = scope.endereco.bairro;

							 		if(scope.endereco.cidade && scope.endereco.cidade !== user.endereco.cidade)
							 			newdata.city = scope.endereco.cidade;

							 		if(scope.endereco.selectStates.uf && scope.endereco.selectStates.uf !== user.endereco.estado)
							 			newdata.state = scope.endereco.selectStates.uf;

							 		if(scope.endereco.selectCountry.sigla && scope.endereco.selectCountry.sigla !== user.endereco.pais)
							 			newdata.country = scope.endereco.selectCountry.sigla;

							 		if(scope.endereco.cep && scope.endereco.cep !== user.endereco.cep.replace(/\D/g,"") ){
							 			aux = scope.endereco.cep;
							 			aux = aux.replace(/(\d)(\d{3})$/,"$1-$2");
							 			newdata.cep = aux;
							 		}
							 	}

						 		authService.update(newdata)
						 					.then(function(res){
						 							console.log(res);
						 							scope.confirm = false;
						 							if(res.data.success){
						 								scope.typeMsgEdit = "alert-box info radius";
						 								scope.msgEdit = "Dados Atualizados com SUCESSO!";
						 							}else{
						 								scope.typeMsgEditPass = "alert-box alert radius";
						 								scope.msgEdit = "Falha ao atualizar dados!";
						 							}
						 							return res;
						 						});		

					 	}

					 	scope.editPassword = function(){
						 		var user = authService.getUser();
						 		var data = { 
						 					 password : scope.currentPassword, 
						 					 newpassword : scope.newpassword,
						 					 renewpassword : scope.repassword,
						 					 userid : user.id
						 					};
						 			resetMSG();
						 		
						 		authService.updatePassword(data)
						 					.then(function(res){
						 							if(res.data.success){
						 								scope.typeMsgEditPass = "alert-box info radius";
						 								scope.msgEditPass = "Senha Atualizada com SUCESSO!";
						 							}else{
						 								scope.typeMsgEditPass = "alert-box alert radius";
						 								scope.msgEditPass = "Falha ao tentar atualizar a Senha!";
						 							}
						 							return res;
						 						});		

					 	}

					 	scope.verifyPassword = function(password){
					 		
						 		resetMSG();
						 		authService.verifyPassword(password)
						 					.then(function(res){

						 							if(!res.data.success){
						 								scope.typeMsgEditConfirm = "alert-box error radius";
						 								scope.msgEditConfirm = "Senha Incorreta!";
						 							}else{
						 								scope.checkPassword = false;
						 								scope.confirm = true;
						 								scope.typeMsgEdit = "alert-box info radius";
						 								scope.msgEdit = "Confirmação de Senha ok!";
						 							}

						 							return res;
						 						});
					 	}

					 	scope.cancel = init;
					 	init();

					 }]);
})();