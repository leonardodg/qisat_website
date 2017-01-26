(function() {
    'use strict';

	 angular
	 	.module('QiSatApp')
	 	.provider('authService',  function(){

					var authToken, authUser, persistent, checkAuth = false;
						
		 			(function load(){
		 				var token, user;
		 				if(!isLogged()){
							user  = window.localStorage.getItem('user') || window.sessionStorage.getItem('user');
							token = window.localStorage.getItem('token') || window.sessionStorage.getItem('token');
	 						user = JSON.parse(user);
	 						setToken(token);
	 						setUser(user);
						}
					})();

					function isAuth() {
						return checkAuth;
					};

					function getUser() {
						return authUser;
					};

					function getToken() {
						return authToken;
					};

					function setUser(user) {
						if (user && typeof user !== "undefined" && user !== "undefined" ){
							authUser = user;
							return true;
						}
						return false;
					};

					function setToken(token) {
						if (token && typeof token !== "undefined" && token !== "undefined"){
							authToken = token;
							return true;
						}
						return false;
					};

					function isLogged (){
						return (authToken && typeof authToken !== "undefined" && authToken !== "undefined" 
								&& authUser && typeof authUser !== "undefined" && authUser !== "undefined" )
	 						? true : false;
					}

					this.$get = function($rootScope, $http, $q, $cookies, Config) {

							function verifyAuth() {
									var deferred = $q.defer(), promise;
									
									if(isLogged()){

										promise = $http({ 
								                      method: 'POST', 
								                      url: Config.baseUrl+'/wsc-user/checkAuth',
						                        	  dataType: 'jsonp',
								                      headers : {
															      'Content-Type' : 'application/json',    
															      'Authorization': Config.Authorization+" "+authToken,
															      },
													   withCredentials : true

						                            });

										promise.then( function success(res) {

						                            	if(res.data.retorno.sucesso){
						                            		useCredentials(res.data.token, res.data.retorno.usuario);
						                            		deferred.resolve(res);
						                            	}else{
						                            		console.log('Error verifyAuth SEM SUCCESS');
						                            		destroyUserCredentials();
						                            		deferred.reject(res);
						                            	}
						                            		
						                            }, function error(res) {

						                            	console.log('Error verifyAuth FALHA!');
						                            	destroyUserCredentials();
						                            	deferred.reject(res);

						                            });

									}else{
										deferred.reject(function(res){ return res });
									}


						            return deferred.promise;
		                		};
							
							function useCredentials(token, user, remember) {
								persistent = typeof remember !== 'undefined' ?  remember : true;

								if(setToken(token) && setUser(user)){
									checkAuth = true;
									user = JSON.stringify(user);
									$http.defaults.headers.common.Authorization = authToken;
									if(persistent){
										window.localStorage.setItem('user', user);
										window.localStorage.setItem('token', token);
									}else{
										window.sessionStorage.setItem('user', user);
										window.sessionStorage.setItem('token', token);
									}
								}
							};

							function destroyUserCredentials() {
								checkAuth = false;
								authUser = undefined;
								authToken = undefined;
								window.localStorage.removeItem('user');
								window.localStorage.removeItem('token');
								window.sessionStorage.removeItem('user');
								window.sessionStorage.removeItem('token');
								var promise = $http({
									method: 'POST',
									url: Config.baseUrl+'/wsc-user/logout',
									dataType: 'jsonp',
									headers : {
										'Content-Type' : 'application/json',
									},
									withCredentials : true
								});
								promise.then( function (res){
									return res;
								});
								$http.defaults.headers.common.Authorization = undefined;
							};
						 
							function login(credentials) {

	                           var promise = $http({ 
	                                                  method: 'POST', 
	                                                  url: Config.baseUrl+'/wsc-user/login',
	                                                  data: credentials,
	                                                  withCredentials : true,
	                                                  headers : { 'Content-Type' : 'application/json' }
	                                                        });

	                            return  promise.then( function (res){
	                            			if((res && res.status == 200 && res.data)&&(res.data.retorno && res.data.retorno.sucesso))
	                            				useCredentials(res.data.token, res.data.retorno.usuario, credentials.remember );

	                            			return res;
	                            		}, function(res){
	                            			return res;
	                            		});
			                };

			                function verifyPassword(password) {

	                           var promise = $http({ 
	                                                  method: 'POST', 
	                                                  url: Config.baseUrl+'/wsc-user/checkPassword',
	                                                  data: { password : password },
	                                                  dataType: 'jsonp',
								                      headers : {
															      'Content-Type' : 'application/json',    
															      'Authorization': Config.Authorization+" "+authToken
															      },
													   withCredentials : true

	                                                        });

	                            return  promise.then( function (res){
	                            			return res;
	                            		});
			                };

			                function update(data) {
								data['id'] = authUser.id;
	                           var promise = $http({ 
	                                                  method: 'POST', 
	                                                  url: Config.baseUrl+'/wsc-user/create-user',
	                                                  data: data,
	                                                  dataType: 'jsonp',
								                      headers : {
															      'Content-Type' : 'application/json',    
															      'Authorization': Config.Authorization+" "+authToken
															      },
													   withCredentials : true

	                                                        });

	                            return  promise.then( function (res){
	                            			return res;
	                            		});
			                };

			                function courses() {

	                           var promise = $http({ 
	                                                  method: 'POST', 
	                                                  url: Config.baseUrl+'/wsc-user/matriculas',
	                                                  data: { id : authUser.id },
	                                                  dataType: 'jsonp',
								                      headers : {
															      'Content-Type' : 'application/json',    
															      'Authorization': Config.Authorization+" "+authToken
															      },
													   withCredentials : true

	                                                        });

	                            return  promise.then( function (res){
	                            						if(res && res.data && res.data.retorno && res.data.retorno.sucesso && res.data.retorno.matriculas ){
	                            							res.data.retorno.matriculas.map(function (curso){
	                            								var tipo;
	                            								if(curso && curso.produto && curso.produto.categorias){
		                            								if(tipo = curso.produto.categorias.find(function(tipo){ return tipo.id == 32 })) { // Séries
																		curso.modalidade = tipo.nome;
																		curso.isSerie = true;
																	}else if(tipo = curso.produto.categorias.find(function(tipo){ return tipo.id == 17 })){ // Pacotes
																		curso.modalidade = tipo.nome;
																		curso.isPack = true;
																	}else if(tipo = curso.produto.categorias.find(function(tipo){ return tipo.id == 40 })){ // PALESTRAS
																		curso.modalidade = tipo.nome;
																		curso.isLecture = true;
																	}else if(tipo = curso.produto.categorias.find(function(tipo){ return tipo.id == 12 })){ // Presenciais Individuais
																		curso.modalidade = tipo.nome;
																		curso.isIndividual = true;
																	}else if(tipo = curso.produto.categorias.find(function(tipo){ return tipo.id == 10 })){ // Presencial
																		curso.modalidade = tipo.nome;
																		curso.isClassroom = true;
																	}else if(tipo = curso.produto.categorias.find(function(tipo){ return tipo.id == 2 })){ // A Dinstancia
																		curso.modalidade = tipo.nome;
																		curso.isOnline = true;
																	}
	                            								}
	                            							});
															return res.data.retorno;
	                            						}else
	                            							return res;
	                            		}, function (res){return res});
			                };

			                function compras() {

	                           var promise = $http({ 
	                                                  method: 'POST', 
	                                                  url: Config.baseUrl+'/wsc-user/financeiro',
	                                                  data: { id : authUser.id },
	                                                  dataType: 'jsonp',
								                      headers : {
															      'Content-Type' : 'application/json',    
															      'Authorization': Config.Authorization+" "+authToken
															      },
													   withCredentials : true

	                                                        });

	                            return  promise.then( function (res){

	                            			return res;
	                            		});
			                };

			                function certificados() {

	                           var promise = $http({ 
	                                                  method: 'POST', 
	                                                  url: Config.baseUrl+'/wsc-user/certificados',
	                                                  data: { id : authUser.id },
	                                                  dataType: 'jsonp',
								                      headers : {
															      'Content-Type' : 'application/json',    
															      'Authorization': Config.Authorization+" "+authToken
															      },
													   withCredentials : true

	                                                        });

	                            return  promise.then( function (res){
	                            			return res;
	                            		});
			                };

			                function carrinho(id) {

	                           var promise = $http({ 
	                                                  method: 'POST', 
	                                                  url: Config.baseUrl+'/wsc-user/financeiro/get',
	                                                  data: { venda : id },
	                                                  dataType: 'jsonp',
								                      headers : {
															      'Content-Type' : 'application/json',    
															      'Authorization': Config.Authorization+" "+authToken
															      },
													   withCredentials : true

	                                                        });

	                            return  promise.then( function (res){
	                            			return res;
	                            		});
			                };


			                function updatePassword(data) {

	                           var promise = $http({ 
	                                                  method: 'POST', 
	                                                  url: Config.baseUrl+'/wsc-user/updatePassword',
	                                                  data: data,
	                                                  dataType: 'jsonp',
								                      headers : {
															      'Content-Type' : 'application/json',    
															      'Authorization': Config.Authorization+" "+authToken
															      },
													   withCredentials : true

	                                                        });

	                            return  promise.then( function (res){
	                            			return res;
	                            		});
			                };



							return {
									login : login, 
									logout: destroyUserCredentials,
			    					isLogged : isLogged, 
			    					isAuth : isAuth,
			    					verifyAuth : verifyAuth,
			    					verifyPassword : verifyPassword,
			    					updatePassword : updatePassword,
			    					getUser : getUser,
			    					getToken : getToken, 
			    					update : update,
			    					courses : courses,
			    					compras :  compras,
			    					carrinho : carrinho,
			    					certificados : certificados
								};
					};
				});

})();
