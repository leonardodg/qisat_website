(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('singupController', ['$rootScope', '$scope', 'QiSatAPI', 'postmon', 'Config', '$location', 'authService',
					 function($rootScope, scope, QiSatAPI, postmon, Config, $location, authService) {

					 	scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,6}$/;
					 	scope.country = Config.country;
					 	scope.states = Config.states;
					 	scope.submitted = false;
					 	scope.cadastro = {};
				 		scope.endereco = {};
				 		scope.endereco.selectCountry = { sigla : 'BR', pais : 'Brasil' };
				 		scope.endereco.selectStates = {"id":24,"nome":"Santa Catarina","uf":"SC","local":"SC - Santa Catarina"};						 			

					 	scope.buscaCEP = function(cep){
					 		if(cep && !scope.createForm.cep.$invalid){
						 		postmon.getCEP(cep).then(function(data){
						 			if(data){
							 			scope.endereco = data;
							 			scope.endereco.selectStates = scope.states.find(function(state){ return data.estado == state.uf });
							 			scope.endereco.selectCountry = { sigla : 'BR', pais : 'Brasil' };
							 		}
						 			return data;
						 		});
					 		}
					 	}

					 	scope.create = function(){
						 		var newdata = {}, aux;
						 		scope.submitted = true;
							 	scope.typeMsgCreate = "";
						 		scope.msgCreate = "";

						 		// if(!scope.createForm.$error.captcha){

						 			if(scope.cadastro.firstname)
						 			newdata.firstname = scope.cadastro.firstname;

						 		if(scope.cadastro.lastname)
						 			newdata.lastname = scope.cadastro.lastname;

						 		if(scope.cadastro.email)
						 			newdata.email = scope.cadastro.email;

						 		if(scope.cadastro.cpfcnpj){
						 				aux = scope.cadastro.cpfcnpj;
						 				if(aux.length == 11){
								 			newdata.tipousuario = 'fisico';
						 					aux = aux.replace( /(\d{3})(\d)/ , "$1.$2"); 
										    aux = aux.replace( /(\d{3})(\d)/ , "$1.$2"); 
										    aux = aux.replace( /(\d{3})(\d{1,2})$/ , "$1-$2");
										    newdata.cpf = aux;
						 				}else{
								 			newdata.tipousuario = 'juridico';
										    aux = aux.replace( /^(\d{2})(\d)/ , "$1.$2"); 
										    aux = aux.replace( /^(\d{2})\.(\d{3})(\d)/ , "$1.$2.$3"); 
										    aux = aux.replace( /\.(\d{3})(\d)/ , ".$1/$2");
										    aux = aux.replace( /(\d{4})(\d)/ , "$1-$2");
										    newdata.cnpj = aux;
										}
										
						 		}

						 		if(scope.cadastro['numero_crea'])
						 			newdata['numero_crea'] = scope.cadastro['numero_crea'];

							 	if(scope.cadastro['password'] && !scope.createForm.repassword.$error.pwmatch)
							 		newdata.password = scope.cadastro['password']
						 		
						 		if(scope.cadastro.phone1){
						 			aux = scope.cadastro.phone1;
						 			aux = aux.replace(/^(\d{2})(\d)/g,"($1)$2");
						 			if(aux.length <= 10)
						 				aux = aux.replace(/(\d)(\d{5})$/,"$1-$2"); 
						 			else
						 				aux = aux.replace(/(\d)(\d{4})$/,"$1-$2"); 
						 			newdata.phone1 = aux;
						 		}

						 		if(scope.endereco){
							 		if(scope.endereco.logradouro)
							 			newdata.address = scope.endereco.logradouro;

							 		if(scope.endereco.numero)
							 			newdata.number = scope.endereco.numero;
							 		
							 		if(scope.endereco.complemento)
							 			newdata.complement = scope.endereco.complemento;

							 		if(scope.endereco.bairro)
							 			newdata.district = scope.endereco.bairro;

							 		if(scope.endereco.cidade)
							 			newdata.city = scope.endereco.cidade;

							 		if(scope.endereco.selectStates.uf)
							 			newdata.state = scope.endereco.selectStates.uf;

							 		if(scope.endereco.selectCountry.sigla)
							 			newdata.country = scope.endereco.selectCountry.sigla;

							 		if(scope.endereco.cep){
							 			aux = scope.endereco.cep;
							 			aux = aux.replace(/(\d)(\d{3})$/,"$1-$2");
							 			newdata.cep = aux;
							 		}
							 	// }

						 		QiSatAPI.createUser(newdata)
						 					.then(function(res){
						 							var credentials = { password : scope.cadastro.password };

						 							if(res && res.data && res.data.retorno && res.data.retorno.sucesso){
						 								scope.typeMsgCreate = "alert-box info radius";
						 								scope.msgCreate = "Cadastro Criado com SUCESSO!";
												 		scope.cadastro = {};
												 		scope.password = '';
												 		scope.endereco = {};
												 		scope.endereco.selectCountry = { sigla : 'BR', pais : 'Brasil' };
												 		scope.endereco.selectStates = {"id":24,"nome":"Santa Catarina","uf":"SC","local":"SC - Santa Catarina"};
												 		scope.createForm.$setPristine();
												 		scope.submitted = false;

												 		
												 		credentials.username = res.data.retorno.usuario.username;

												 		authService.login(credentials).then(function (res){
										 					if((res.status == 200)&&(res && res.data && res.data.retorno && res.data.retorno.sucesso))
										 						window.location = '/aluno/cursos';
										 					else
										 						$location.path('/login');
										 					
											 			});

						 							}else{
						 								scope.typeMsgCreate = "alert-box alert radius";
						 								scope.msgCreate = "Falha ao atualizar dados!";
						 							}
						 							return res;
						 						});	

						 		}

					 	}

					 	scope.cancel = function(){
					 		scope.submitted = false;
					 		scope.cadastro = null;
					 		scope.endereco = null;
					 		scope.createForm.$setPristine();
					 	}

					 }]);
})();