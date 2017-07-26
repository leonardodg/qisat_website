(function() {
    'use strict';

	 angular
	 	.module('QiSatApp')
	 	.provider('authService',  function(){

					var authToken, authUser, persistent, checkAuth = false, redirect, reset;
						
		 			function load(){
		 				var token, user;

						user  = window.localStorage.getItem('user') || window.sessionStorage.getItem('user');
						token = window.localStorage.getItem('token') || window.sessionStorage.getItem('token');
 						user = JSON.parse(user);
 						setToken(token);
 						setUser(user);
						
						if((setUser(user) == false || setToken(token) == false) && isLogged())
							reset();

						redirect = window.localStorage.getItem('redirect');
					};

					function isAuth() {
						return checkAuth && isLogged();
					};

					function getRedirect(){
						if (redirect && typeof redirect !== "undefined" && redirect !== "undefined" )
							return redirect;
					};

					function setRedirect(url){
						if (url && typeof url !== "undefined" && url !== "undefined" )
							window.localStorage.setItem('redirect', url);
						else
							window.localStorage.removeItem('redirect');
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

					this.$get = function($rootScope, $http, $q, $cookies, $location, Config) {


				            function Authenticated ( path ){
				                      return isAuth() || verifyAuth()
				                                         .then( function (res){ 
			                                                  if(res) return true; 
			                                                  else if(path) $location.path(path);
			                                                  return false;
			                                                }, function (res){ 
			                                                     if(path) $location.path(path); 
			                                                     return false;
			                                                });
				            };

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

						                            	if(res && res.data && res.data.retorno && res.data.retorno.sucesso){
						                            		useCredentials(res.data.token, res.data.retorno.usuario);
						                            		deferred.resolve(function(res){ return true; });
						                            	}else{
						                            		console.log('Error verifyAuth SEM SUCCESS');
						                            		destroyUserCredentials();
						                            		deferred.reject( function(res){ return false; });
						                            	}
						                            		
						                            }, function error(res) {

						                            	console.log('Error verifyAuth FALHA!');
						                            	destroyUserCredentials();
						                            	deferred.reject( function(res){ return false; });

						                            });

									}else{
										deferred.reject( function(res){ return false; });
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
								}else reset();
							};

							reset = function() {
								checkAuth = false;
								authUser = undefined;
								authToken = undefined;
								$http.defaults.headers.common.Authorization = undefined;
							};

							function destroyUserCredentials() {
								checkAuth = false;
								authUser = undefined;
								authToken = undefined;
								window.localStorage.removeItem('user');
								window.localStorage.removeItem('token');
								window.sessionStorage.removeItem('user');
								window.sessionStorage.removeItem('token');
								window.localStorage.removeItem('redirect');
								$http.defaults.headers.common.Authorization = undefined;
								var promise = $http({
									method: 'POST',
									loading : true,
									url: Config.baseUrl+'/wsc-user/logout',
									dataType: 'jsonp',
									headers : { 'Content-Type' : 'application/json' },
									withCredentials : true
								});
								return promise.then( function (res){
									return res;
								});
							};
						 
							function login(credentials) {
	                           var promise = $http({ 
	                                                  method: 'POST', 
	                                                  loading : true,
	                                                  url: Config.baseUrl+'/wsc-user/login',
	                                                  data: credentials,
	                                     			  dataType: 'jsonp',
	                                                  headers : { 'Content-Type' : 'application/json' },
	                                                  withCredentials : true
	                                                        });

	                            return  promise.then( function (res){
	                            			
	                            				if((res && res.status == 200 && res.data)&&(res.data.retorno && res.data.retorno.sucesso)){
	                            					useCredentials(res.data.token, res.data.retorno.usuario, credentials.remember );
	                            				}
	                            			
	                            			return res;
	                            		}, function(res){
	                            			return res;
	                            		});
			                };

			                function verifyPassword(password) {
		                		var deferred = $q.defer(), promise;
								
								if(isAuth()){
		                           promise = $http({ 
		                                                  method: 'POST', 
		                                                  loading : true,
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
								}else{
									deferred.reject(function(res){ return false });
									return deferred.promise;
								}
			                };

			                function update(data) {
		                		var deferred = $q.defer(), promise;
								
								if(isAuth()){
									data['id'] = authUser.id;
		                            promise = $http({ 
		                                              method: 'POST', 
		                                              loading : true,
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
								}else{
									deferred.reject(function(res){ return false });
									return deferred.promise;
								}
			                };

			                function updateFile(data) {
		                		var deferred = $q.defer(), promise;

								if(isAuth()){
		                            promise = $http({ 
		                                              method: 'POST', 
		                                              loading : true,
		                                              url: Config.baseUrl+'/wsc-user/uploadImagemUsuario',
		                                              data: data,
								                      headers : {  'Content-Type': undefined, 'Authorization': Config.Authorization+" "+authToken },
													  withCredentials : true,
													  transformRequest: angular.identity
	                                            	});

		                            return  promise.then( function (res){
		                            			return res;
		                            		});
								}else{
									deferred.reject(function(res){ return false });
									return deferred.promise;
								}
			                };


			                function getUserDados(id) {
		                		var deferred = $q.defer(), promise;
								
								if(isAuth()){
									var data = { id: authUser.id };
		                            promise = $http({ 
		                                              method: 'POST', 
		                                              url: Config.baseUrl+'/wsc-user/user',
		                                              data: data,
		                                              dataType: 'jsonp',
								                      headers : {
															      'Content-Type' : 'application/json',    
															      'Authorization': Config.Authorization+" "+authToken
															      },
													   withCredentials : true
	                                            	});

		                            return  promise.then( function (res){
		                            			console.log(res);
		                            			if(res && res.data && res.data.retorno && res.data.retorno.sucesso && res.data.retorno.user)
		                            				return res.data.retorno.user;
		                            			return false;
		                            		});
								}else{
									deferred.reject(function(res){ return false });
									return deferred.promise;
								}
			                };

			                function courses() {
			                	var deferred = $q.defer(), promise;

								if(isAuth()){
		                           	promise = $http({ 
                                                  method: 'POST', 
                                                  loading : true,
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
			                            								if(tipo = curso.produto.categorias.find(function(tipo){ return tipo.id == 32 || tipo.id == 33 || tipo.id == 41 })) { // Séries
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
                    				
								}else{
									deferred.reject(function(res){ return false });
									return deferred.promise;
								}
			                };


		                  function inscricao(produto) {
			                	var deferred = $q.defer(), promise;

								if(isAuth()){
		                           	promise = $http({ 
                                                  method: 'POST', 
                                                  loading : true,
                                                  url: Config.baseUrl+'/web-service/wsc-inscricao/inscrever',
                                                  data: { produto : produto },
                                                  dataType: 'jsonp',
							                      headers : {
														      'Content-Type' : 'application/json',    
														      'Authorization': Config.Authorization+" "+authToken
														      },
												   withCredentials : true

                                                        });

		                            return  promise.then( function (res){
				                            				return res;
					                            		}, function (res){return res});
                    				
								}else{
									deferred.reject(function(res){ return false });
									return deferred.promise;
								}
			                };


			                function compras() {
			                		var deferred = $q.defer(), promise;
									
									if(isAuth()){
			                           	promise = $http({ 
	                                                  method: 'POST', 
	                                                  loading : true,
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

									}else{
										deferred.reject(function(res){ return false });
										return deferred.promise;
									}
			                };

			                function certificados() {
		                			var deferred = $q.defer(), promise;
									
									if(isAuth()){
	                           			promise = $http({ 
		                                                  method: 'POST', 
		                                                  loading : true,
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
									}else{
										deferred.reject(function(res){ return false });
										return deferred.promise;
									}
			                };

			                function carrinho(id) {
			                	var deferred = $q.defer(), promise;
									
								if(isAuth()){
		                        	promise = $http({ 
	                                                  method: 'POST', 
	                                                  loading : true,
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
								}else{
									deferred.reject(function(res){ return false });
									return deferred.promise;
								}
			                };

			                function updatePassword(data) {
			                	var deferred = $q.defer(), promise;

								if(isAuth()){
                    				promise = $http({ 
                                                  method: 'POST', 
                                                  loading : true,
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
								}else{
									deferred.reject(function(res){ return false });
									return deferred.promise;
								}
			                };

							return {
									Authenticated : Authenticated,
									load : load, 
									login : login, 
									logout: destroyUserCredentials,
			    					isLogged : isLogged, 
			    					isAuth : isAuth,
			    					verifyAuth : verifyAuth,
			    					verifyPassword : verifyPassword,
			    					updatePassword : updatePassword,
			    					getUser : getUser,
			    					getUserDados : getUserDados,
			    					getToken : getToken, 
			    					update : update,
			    					updateFile : updateFile,
			    					courses : courses,
			    					inscricao : inscricao,
			    					compras :  compras,
			    					carrinho : carrinho,
			    					certificados : certificados,
			    					getRedirect : getRedirect,
			    					setRedirect : setRedirect
								};
					};
				});

})();
