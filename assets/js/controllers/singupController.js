(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('singupController', ['$scope', '$controller', '$location' ,'QiSatAPI', 'postmon', 'Config', 'authService',
					 function(scope, $controller, $location, QiSatAPI, postmon, Config, authService) {

					 	var modalController = $controller('modalController');
					 	scope.etapa=1;
					 	scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,6}$/;
					 	scope.country = Config.country;
					 	scope.states = Config.states;
					 	scope.statesCREAs = angular.copy(Config.states);
					 	scope.submitted = false;
					 	scope.cadastro = { email_oferta : true };
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
					 	};

					 	scope.next = function(){
				 			var aux, lastname, error = false, msgError = '';
					 		scope.submitted = true;

					 		if(scope.etapa == 1){

				 			    if(scope.createForm.name.$valid){
				 			    	aux = scope.cadastro.firstname.split(' ');
						 			aux.shift();
						 			lastname = aux.join(' ');

						 			if(!lastname.length){
							 			msgError += '<br/> - Preencha o Nome Completo.';
							 			error = true;
						 			}
				 			    }else error = true;
				 				
				 				if(scope.createForm.email.$invalid
				 					|| scope.createForm.phone.$invalid 
				 					|| scope.createForm.cpfcnpj.$invalid 
				 					|| scope.createForm.password.$invalid 
				 					|| scope.createForm.repassword.$invalid )
				 					error = true;

					 		}else if(scope.etapa == 2){

					 			if(scope.createForm.cep.$invalid
			 					|| scope.createForm.cidade.$invalid 
			 					|| scope.createForm.bairro.$invalid 
			 					|| scope.createForm.logradouro.$invalid )
			 					error = true;

					 		}else if(scope.etapa == 3){
					 			
				 				if(scope.createForm.crea.$valid ){
						 			scope.submitted = false;
						 			scope.create();
						 			return;
				 				}else error = true;
					 		}
				 			
					 		 if(!error){
			 			    	scope.submitted = false;
				 				scope.etapa++;
			 			    }else
				 				modalController.alert({ error : true, main : { html: true, title : "Preencha os dados corretamente!"+msgError } });
						 	return;
					 	};

					 	scope.back = function(){
					 		scope.etapa--;
					 	};

					 	scope.remember = function(){
							var data = { email : scope.cadastro.email };
								scope.msgRemember = '';
								QiSatAPI.remember(data)
											.then( function ( response ){
													if(response && response.data && response.data.retorno && response.data.retorno.sucesso)
														scope.msgRemember = "Lembrete de senha enviado com Sucesso!";
												    else if((response.status == 200)&&(response && response.data && response.data.retorno && response.data.retorno.mensagem))
						 								scope.msgRemember = "Falha no Envio da Mensagem. "+response.data.retorno.mensagem;
												    else
												    	scope.msgRemember = "Falha no Envio da Mensagem.";
												}, function ( response ){
													scope.msgRemember = "Falha no Envio da Mensagem.";
												});
						};

					 	scope.create = function(){
						 		var newdata = {}, aux;

						 		if(!Object.keys(scope.createForm.$error).length ) {

							 		if(scope.cadastro.firstname){
							 			aux = scope.cadastro.firstname.split(' ');
							 			newdata.firstname = aux[0];
							 			aux.shift();
							 			newdata.lastname = aux.join(' ');
							 		}

							 		if(scope.cadastro.email)
							 			newdata.email = scope.cadastro.email;

							 		newdata.email_oferta = scope.cadastro.email_oferta ? true : false;

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
							 		}

							 		if(scope.cadastro.selectCrea && scope.cadastro['numero_crea']){
							 			newdata.entidades = [   
							 									{ 
								 									entidade : scope.cadastro.selectCrea,
								 									numero : scope.cadastro['numero_crea']
							 									}
							 								];
							 		}
											

						 			QiSatAPI.createUser(newdata)
						 					.then(function(res){
						 							var credentials = { password : scope.cadastro.password };

						 							if(res && res.data && res.data.retorno && res.data.retorno.sucesso){

														window.localStorage.setItem('email', scope.cadastro.email);

												 		scope.cadastro = {};
												 		scope.password = '';
												 		scope.endereco = {};
												 		scope.endereco.selectCountry = { sigla : 'BR', pais : 'Brasil' };
												 		scope.endereco.selectStates = {"id":24,"nome":"Santa Catarina","uf":"SC","local":"SC - Santa Catarina"};
												 		scope.createForm.$setPristine();
												 		scope.submitted = false;
												 		
												 		//$location.path('/login');
														$location.path('/confirmar-cadastro');

												 		modalController.alert({ success : true, main : { title : "Obrigado, por realizar o Cadastro!", subtitle : " Orientação de acesso enviado para o email." } });

						 							}else{
						 								modalController.alert({ error : true, main : { title : "Falha para realizar o Cadastro!" } });
						 								scope.submitted = true;
									 					scope.etapa = 1;
											 			$location.path('/cadastro');
						 							}
						 							return res;
						 						}, function(){ modalController.alert({ error : true, main : { title : "Falha para realizar o Cadastro." } }); });	

						 		}else{
						 			modalController.alert({ error : true, main : { title : "Preencha os dados corretamente!" }});
						 			scope.submitted = true;
				 					scope.etapa = 1;
						 			$location.path('/cadastro');
						 		}
					 	};

					 	scope.saibamais = function(){
					 		modalController.alert({ crea : true });
					 	};

					 	scope.cancel = function(){
					 		scope.submitted = false;
					 		scope.cadastro = null;
					 		scope.endereco = null;
					 		scope.createForm1.$setPristine();
					 		scope.createForm2.$setPristine();
					 		scope.createForm3.$setPristine();
					 	};

					 }]);
})();