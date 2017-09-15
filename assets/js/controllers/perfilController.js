(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('perfilController', ['$scope', '$controller', 'QiSatAPI', 'authService','Authenticated', 'postmon', 'Config',
					 function(scope, $controller, QiSatAPI, authService, Authenticated, postmon, Config ) {

						var modalController = $controller('modalController');

						function validateCNPJ(c) {
							var b = [6,5,4,3,2,9,8,7,6,5,4,3,2];
							c = c.replace(/[^\d]/g,'').split('');
							if(c.length !== 14) {
								return false;
							}

							for (var i = 0, n = 0; i < 12; i++) {
								n += c[i] * b[i+1];
							}
							n = 11 - n%11;
							n = n >= 10 ? 0 : n;
							if (parseInt(c[12]) !== n)  {
								return false;
							}

							for (i = 0, n = 0; i <= 12; i++) {
								n += c[i] * b[i];
							}
							n = 11 - n%11;
							n = n >= 10 ? 0 : n;
							if (parseInt(c[13]) !== n)  {
								return false;
							}
							return true;
						};

						function validateCPF(cpf) {
							cpf = cpf.replace(/[^\d]+/g,'');
							if (cpf === '' || cpf === '00000000000' || cpf.length !== 11) {
								return false;
							}
							function validateDigit(digit) {
								var add = 0;
								var init = digit - 9;
								for (var i = 0; i < 9; i ++) {
									add += parseInt(cpf.charAt(i + init)) * (i+1);
								}
								return (add%11)%10 === parseInt(cpf.charAt(digit));
							}
							return validateDigit(9) && validateDigit(10);
						};

					 	function init() {
						 		scope.confirm = false;
						 		scope.submited = false;
							 	scope.checkPassword = false;
							 	scope.showEditPassword = false;
							 	scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,6}$/;
							 	scope.country = Config.country;
							 	scope.states = Config.states;
							 	scope.statesCREAs = angular.copy(Config.states);

						 		if(Authenticated){
							 		scope.user = angular.copy(authService.getUser());
							 		scope.user.cpfcnpj = scope.user.numero;

							 		if(scope.user.endereco){
								 		scope.endereco = scope.user.endereco;
										scope.endereco.cidade = scope.user.city;
										scope.endereco.bairro = scope.user.endereco.district;
										scope.endereco.pais	= scope.user.country;
										scope.endereco.estado = scope.user.endereco.state;
										scope.endereco.numero = scope.user.endereco.number;
										scope.endereco.complemento = scope.user.endereco.complement;

										if(scope.endereco.pais) 
							 				scope.endereco.selectCountry = scope.country.find(function(country){ return country.sigla == scope.endereco.pais });
								 		else 
								 			scope.endereco.selectCountry = { sigla : 'BR', pais : 'Brasil' };

								 		if(scope.endereco.estado) 
								 			scope.endereco.selectStates = scope.states.find(function(state){ return state.uf == scope.endereco.estado });
								 		else
								 			scope.endereco.selectStates = {"id":24,"nome":"Santa Catarina","uf":"SC","local":"SC - Santa Catarina"};
							 		}else{
							 			scope.endereco = {};
							 			scope.endereco.selectCountry = { sigla : 'BR', pais : 'Brasil' };
							 			scope.endereco.selectStates = {"id":24,"nome":"Santa Catarina","uf":"SC","local":"SC - Santa Catarina"};
							 		}

							 		if(!scope.user.email) scope.getEmail = true;
							 		
							 		if(scope.user.cpfcnpj){
							 			scope.user.cpfcnpj = scope.user.cpfcnpj.replace(/[^\d]+/g,'');
							 			if(scope.user.cpfcnpj.length <= 11){
											if(!validateCPF(scope.user.cpfcnpj))
												scope.getCPF = true;
										}else if(!validateCNPJ(scope.user.cpfcnpj)){
												scope.getCPF = true;
										}
							 		}else{
							 			scope.getCPF = true;
							 		}

							 		if(scope.user.endereco && scope.user.endereco.cep) 
							 			scope.user.endereco.cep = scope.user.endereco.cep.replace(/[^\d]+/g,'');

							 		if(scope.user.phone1) 
							 			scope.user.phone1 = scope.user.phone1.replace(/[^\d]+/g,'');

							 		if(!scope.user.picture)
							 			scope.user.picture = Config.imgUserDefault;

							 		if(scope.user.entidades && scope.user.entidades.length){
							 			scope.user.entidades = scope.user.entidades.map(function(e){
							 					e.selectCrea = scope.statesCREAs.find(function(o){ return o.host == e.id });
							 					e.statusA =  (e.adimplente) ? 'Adimplente' : 'Inadimplente';
							 					e.statusC =  (e.confirmado) ? 'Confirmado' : 'Não Confirmado';
							 					return e;
							 			});
							 		}else
						 				scope.user.entidades = [];

						 		}
					 	}

					 	scope.clickEditPassword = function(){
					 		scope.showEditPassword = !scope.showEditPassword;
					 	};

					 	
					 	scope.saibamais = function(){
					 		modalController.alert({ crea : true });
					 	};

					 	scope.addCrea = function(){
					 		if(scope.user.entidades)
					 			scope.user.entidades.push({});
					 		else
					 			scope.user.entidades = [{}];
					 	};

					 	scope.removeCrea = function(id){
					 		var i;
					 		if(scope.user.entidades && scope.user.entidades.length){
					 			i = scope.user.entidades.findIndex(function(e){ return e.id == id; });
					 			scope.user.entidades.splice(i, 1);

					 			if(scope.editForm['crea'+i]){
					 				delete(scope.editForm['crea'+i]);
					 				delete(scope.editForm['selectCrea'+i]);
					 			}
					 		}
					 	}

					 	scope.buscaCEP = function(cep){
					 		if(cep && !scope.editForm.cep.$invalid){
						 		postmon.getCEP(cep).then(function(data){
						 			if(data){
							 			scope.endereco = data;
							 			scope.endereco.selectStates = scope.states.find(function(state){ return data.estado == state.uf });
							 			scope.endereco.selectCountry = { sigla : 'BR', pais : 'Brasil' };
							 		}
						 			return data;
						 		}, function(data){
						 			if(data.status == 404)
						 				scope.errorcep = 'Dados do CEP não localizado!';
						 		});
					 		}
					 	}

					 	scope.enableInputs = function(){
					 			scope.checkPassword = true;
					 	}

					 	var inputFile = angular.element('#picture');
				 			inputFile.on("change", function(e){
				 				var picture = document.querySelector('#picture');
						 		var data = new FormData();

						 		data.append('picture', picture.files[0]);

								authService.updateFile(data)
							 					.then(function(res){
							 							if(res && res.data && res.data.retorno && res.data.retorno.sucesso)
							 								modalController.alert({ success : true, main : { title : "Dados Atualizados com Sucesso!"} });
							 							else
							 								modalController.alert({ error : true, main : { title : "Falha ao atualizar os dados!"} });
							 							
							 							return res;
							 						}, function(res){ modalController.alert({ error : true, main : { title : "Falha ao atualizar os dados!"} }) });	
						 	});

					 	scope.fileClick = function(){
						 	inputFile.click();
					 	}

					 	scope.update = function(){
						 		var user = authService.getUser();
						 		var newdata = {}, aux;

						 		scope.submited = true;

						 		if(scope.editForm.$valid){



						 		if(scope.user.firstname && scope.user.firstname !== user.firstname)
						 			newdata.firstname = scope.user.firstname;

						 		if(scope.user.lastname && scope.user.lastname !== user.lastname)
						 			newdata.lastname = scope.user.lastname;

						 		if(scope.user.email && scope.user.email !== user.email)
						 			newdata.email = scope.user.email;

						 		if( (!user.numero && scope.user.cpfcnpj) || (scope.user.cpfcnpj && user.numero && scope.user.cpfcnpj !== user.numero.replace(/\D/g,""))){
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

								newdata.email_oferta = scope.user.email_oferta ? true : false;
								newdata.email_andamento = scope.user.email_andamento ? true : false;
								newdata.email_mensagem_privada = scope.user.email_mensagem_privada ? true : false;
								newdata.email_ausente = scope.user.email_ausente ? true : false;
								newdata.email_suporte = scope.user.email_suporte ? true : false;

								newdata.ligacao_lancamentos = scope.user.ligacao_lancamentos ? true : false;
								newdata.ligacao_pagamento = scope.user.ligacao_pagamento ? true : false;

								newdata.sms_informacoes = scope.user.sms_informacoes ? true : false;
								newdata.sms_lancamentos = scope.user.sms_lancamentos ? true : false;

								if(scope.user.entidades && scope.user.entidades.length){
						 			newdata.entidades = [];

						 			scope.user.entidades.map( function (e){
						 				newdata.entidades.push({ 
							 									entidade : e.selectCrea,
							 									numero : e.numero
						 									});
						 			});
						 		}

						 		authService.update(newdata)
						 					.then(function(res){
						 							scope.confirm = false;
						 							scope.submited = false;
						 							if(res.data.retorno.sucesso){
						 								scope.getCPF = false;
						 								scope.getEmail = false;
						 								modalController.alert({ success : true, main : { title : "Dados Atualizados com Sucesso!"} });
						 							}else
						 								modalController.alert({ error : true, main : { title : "Falha ao atualizar dados!"} });

						 						}, function(res){ modalController.alert({ error : true, main : { title : "Falha ao atualizar os dados!"} }) });		 
					 		}else
								modalController.alert({  error : true, main : { title : "Verifique os dados Solicitados!"} });


					 	}

					 	scope.editPassword = function(){
						 		var user = authService.getUser();
						 		var data = { 
						 					 password : scope.currentPassword, 
						 					 newpassword : scope.newpassword,
						 					 renewpassword : scope.repassword,
						 					 userid : user.id
						 					};

						 		authService.updatePassword(data)
						 					.then(function(res){
						 							if(res.data.retorno.sucesso)
						 								modalController.alert({ success : true, main : { title : "Senha Atualizada com Sucesso!"} });
						 							else
						 								modalController.alert({ error : true, main : { title : "Falha ao atualizar os dados!"} });

						 							scope.showEditPassword = false;
						 							return res;
						 						}, function(res){ modalController.alert({ error : true, main : { title : "Falha ao atualizar os dados!"} }) });	

					 	}

					 	scope.verifyPassword = function(password){
					 		
						 		authService.verifyPassword(password)
						 					.then(function(res){

						 							if(!res.data.retorno.sucesso)
						 								modalController.alert({ error : true, main : { title : "Falha na Autenticação!"} });
						 							else{
						 								scope.checkPassword = false;
						 								scope.confirm = true;
						 							}

						 							return res;
						 						}, function(res){ modalController.alert({ error : true, main : { title : "Falha na Autenticação!"} }) });
					 	}

					 	scope.cancel = init;
					 	init();

					 }]);
})();
