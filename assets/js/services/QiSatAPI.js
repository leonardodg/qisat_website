(function() {
    'use strict';

    /*
		QiSatAPI - Service Data Objects
    */

	 angular
	 	.module('QiSatApp')
	 	.factory("QiSatAPI", [ '$http', '$filter', 'Config', 
	 			function($http, $filter, Config){

					var sdo = {

		                        createUser : function (data) {

		                            var promise = $http({ 
		                                                    method: 'post', 
		                                                    url: Config.baseUrl+'/wsc-user/createUser',
		                                                    data: data
		                                                        });

		                            return promise.then( function(res){ 
		                                                    return res; 
		                                                }, function(res){ 
		                                                    return res; 
		                                                });
		                        },

		                        callMe : function(data){

		                        	var promise = $http({ 
		                                                    method: 'POST', 
		                                                    url: Config.baseUrl+'/repasse/wsc-ligamos-para-voce/salvar',
		                                                    data: data
		                                                        });

		                            return promise.then( function(res){ 
		                                                    return res; 
		                                                }, function(res){ 
		                                                    return res; 
		                                                });

		                        },

		                        repasse : function(data){

		                        	var promise = $http({ 
		                                                    method: 'POST', 
		                                                    url: Config.baseUrl+'/repasse/wsc-repasse/salvar',
		                                                    data: data
		                                                        });

		                            return promise.then( function(res){ 
		                                                    return res; 
		                                                }, function(res){ 
		                                                    return res; 
		                                                });

		                        },		                        

		                        checkByEmail : function (email) {

		                            var promise = $http({ 
		                                                    method: 'post', 
		                                                    url: Config.baseUrl+'/wsc-user/checkEmail',
		                                                    data: { email: email }
		                                                        });

		                            return promise.then( function(res){ 
		                                                    return res; 
		                                                }, function(res){ 
		                                                    return res; 
		                                                });
		                        },

		                    	checkByCPF : function (cpf) {

		                            var promise = $http({ 
		                                                    method : 'post', 
		                                                    url : Config.baseUrl+'/wsc-user/checkCPF',
		                                                    data : { cpf: cpf }
		                                                        });

		                            return promise.then( function(res){ 
		                                                    return res; 
		                                                }, function(res){ 
		                                                    return res; 
		                                                });
		                        },

							getInstructorsTop : function () {
									var promise = $http({ 
														cache: true, 
														method: 'GET', 
														url: Config.baseUrl+'/instrutor/wsc-instrutor/top'
													});

										promise.then( handleSuccess, handleError );

									return promise;
							},

							getInstructors : function () {
									var promise = $http({ 
														cache: true, 
														method: 'GET', 
														url: Config.baseUrl+'/instrutor/wsc-instrutor/listar'
													});

										promise.then( handleSuccess, handleError );

									return promise;
							},

							getInstructor : function (id) {
									var promise = $http({ 
														cache: true, 
														method: 'GET', 
														url: Config.baseUrl+'/instrutor/wsc-instrutor/get/'+id
													});

										promise.then( handleSuccess, handleError );

									return promise;
							},


							getStates : function () {
									var promise = $http({ 
														cache: true, 
														method: 'GET', 
														url: Config.baseUrl+'/moodle/estados'
													});

										promise.then( handleSuccess, handleError );

									return promise;
							},

							getCourseStates : function () {
									var promise = $http({ 
															cache: true, 
															method: 'GET', 
															url: Config.baseUrl+'/curso-presencial/wsc-curso-presencial/estados-edicoes'
														});

										promise.then( handleSuccess, handleError );

									return promise;
							},

							getCoursesTop : function () {
									var promise = $http({ 
															cache: true, 
															method: 'GET', 
															url: Config.baseUrl+'/produto/wsc-produto/destaques'
														});

										promise.then( handleSuccess, handleError );

									return promise;
							},

							getInfo : function (course) {

									var promise = $http({ 
															cache: true, 
															method: 'POST',
															data : { id : course },
															url: Config.baseUrl+'/produto/wsc-produto/get-info/'
														});

										return promise.then( function successCallback( res ){
											if(res.status == 200) 
												return res.data.retorno;
										});
							},


							getCourses : function () {
									var promise = $http({ 
													cache: true, 
													method: 'GET', 
													url: Config.baseUrl+'/produto/wsc-produto/listar'
												});

										promise.then( function successCallback( response ){
													var courses = [];
													var filterTypes = $filter('byTypes'),
														filterZpad = $filter('zpad'),
														filterLimitName = $filter('limitName');

													if(response.status == 200) courses = response.data.retorno;
													courses = courses.map( function (course, i) {
																if(course && course.info){
																	var imagemFile, tipo, produto, itens, valorItens = 0, videoDemo;

																	course.imgSrc = Config.imgCursoUrlDefault;
																	course.nomeLimit = filterLimitName(course.info.titulo, 48);

																	//serie, pack, classroom, events, single, releases, free, online
																	if(tipo = course.categorias.find(function(tipo){ return tipo.id == 32 })) { // Séries
																		course.modalidade = tipo.nome;
																		course.isSerie = true;
																	}else if(tipo = course.categorias.find(function(tipo){ return tipo.id == 17 })){ // Pacotes
																		course.modalidade = tipo.nome;
																		course.isPack = true;
																	}else if(tipo = course.categorias.find(function(tipo){ return tipo.id == 40 })){ // PALESTRAS
																		course.modalidade = tipo.nome;
																		course.isLecture = true;
																	}else if(tipo = course.categorias.find(function(tipo){ return tipo.id == 12 })){ // Presenciais Individuais
																		course.modalidade = tipo.nome;
																		course.isIndividual = true;
																	}else if(tipo = course.categorias.find(function(tipo){ return tipo.id == 10 })){ // Presencial
																		course.modalidade = tipo.nome;
																		course.isClassroom = true;
																	}else if(tipo = course.categorias.find(function(tipo){ return tipo.id == 2 })){ // A Dinstancia
																		course.modalidade = tipo.nome;
																		course.isOnline = true;
																	}

																	if(course.imagens && course.imagens.length){
																		imagemFile = course.imagens.find(function(img) { return img.type == 'Imagens - Capa' });
																		if(imagemFile) course.imgSrc = imagemFile.src;
																	}

																	if(course.isSerie && course.produtos && course.produtos.length){
																		
																		course.id = [];
																		produto = course.produtos.find(function (prod){
																			if(prod && prod.categorias)
																				return prod.categorias.find(function(tipo){ return tipo.id == 41 });
																		});

																		if(produto){
																			course.id = produto.id;
																			course.precoTotal =  $filter('currency')(produto.preco, 'R$');
																			if(produto.promocao){
																				course.preco = $filter('currency')(produto.valorTotal, 'R$');
																				course.promocaoDateend = $filter('date')( produto.promocao.datafim*1000, 'dd/MM/yyyy' );
																			}else
																				course.preco = $filter('currency')(produto.preco, 'R$');
																		}else{
																			itens = course.produtos.filter(function (prod){
																										if(prod && prod.categorias)
																											return prod.categorias
																														.find(function(tipo){ return tipo.id == 33 });
																									});

																			if(itens && itens.length){
																				itens.map( function (prod){ 
																								valorItens += prod.preco; 
																								course.id.push(prod.id);
																						 	});
																			}

																			course.precoTotal =  $filter('currency')(valorItens, 'R$');
																			course.preco =  $filter('currency')(valorItens, 'R$');
																		}
																	}else{
																		course.precoTotal =  $filter('currency')(course.preco, 'R$');
																		if(course.promocao){
																			course.preco = $filter('currency')(course.valorTotal, 'R$');
																			course.promocaoDateend = $filter('date')( course.promocao.datafim*1000, 'dd/MM/yyyy' );
																		}else
																			course.preco = $filter('currency')(course.preco, 'R$');
																	}

																	return course;
																}
													});

													return courses;
												}, handleError );
									return promise;
							},

							

							getFilterData : function () {
										var promise = $http({ 
															cache: true, 
															method: 'GET', 
															url: Config.baseUrl+'/produto/wsc-produto/produtos-tipos-id'
														});

										promise.then( handleSuccess, handleError );

										return promise;
							},

							remember : function (data) {
									var promise = $http({ 
															method: 'POST', 
															url: Config.baseUrl+'/wsc-user/lembrete-senha',
															data: data
														});

											promise.then( handleSuccess, handleError );

									return promise;
							},

							getConvenios : function () {
								var promise = $http({ 
															cache: true, 
															method: 'GET',
															url: Config.baseUrl+'/convenio/wsc-convenio/instituicoes-conveniadas'
														});

											promise.then( handleSuccess, handleError );

										return promise;

							},

							login : function (data) {
								var promise = $http({ 
															method: 'POST', 
															url: Config.baseUrl+'/moodle/login',
															data: data
														});

										promise.then( handleSuccess, handleError );

										return promise;

							}

						/*
						 * Função reponsável por inserir convênios
						 * Deve ser feito requisições do tipo POST, informando os seguintes parâmetros no formato JSON:
						 * {
						 *  ecm_convenio_tipo_instituicao_id: 1,
						 *  mdl_cidade_id: 11139,
						 *  nome_responsavel: (nome_responsavel),
						 *  nome_coordenador: (nome_coordenador),
						 *  nome_instituicao: (nome_instituicao),
						 *  curso: (curso),
						 *  disciplina: (disciplina),
						 *  cargo: (cargo),
						 *  email: (email),
						 *  telefone: (telefone)
						 * }
						 *
						 * Retornos:
						 * 1- {'sucesso':true}
						 * 2- {'sucesso':false, 'mensagem': 'Este Web Service não aceita esse tipo de requisição'}
						 * 5- {'sucesso':false, 'mensagem': 'Erro ao salvar repasse'}
						 * 6- {'sucesso':false, 'mensagem': 'Não foi possível inserir o convênio'}
						 * */
							,addInstitution : function (data) {
								var promise = $http({
									method: 'POST',
									url: Config.baseUrl+'/convenio/wsc-convenio/inserir',
									data: data
								});

								promise.then( handleSuccess, handleError );

								return promise;

							},
						/*
						 * Função reponsável por adicionar um interesse de um cliente em um convenio
						 * Deve ser feito requisições do tipo POST:
						 * http://{host}/convenio/wsc-convenio/add-interesse
						 *
						 * Retornos:
						 * 1- {'sucesso':true, 'mensagem': 'Interesse registrado com sucesso'}
						 * 2- {'sucesso':false, 'mensagem': 'O Interesse não pode ser registrado'}
						 * 3- {'sucesso':false, 'mensagem': 'Informe os parâmetros do Interesse'}
						 * 4- {'sucesso':false, 'mensagem': 'Informe o parâmetro Nome'}
						 * 5- {'sucesso':false, 'mensagem': 'Informe o parâmetro Telefone'}
						 * 6- {'sucesso':false, 'mensagem': 'Informe o parâmetro Email'}
						 * 7- {'sucesso':false, 'mensagem': 'Informe o id do convênio'}
						 * */
							addInteresse : function (data) {
								var promise = $http({
									method: 'POST',
									url: Config.baseUrl+'/convenio/wsc-convenio/add-interesse',
									data: data
								});

								promise.then( handleSuccess, handleError );
								return promise;
							},
							/*
							 * Função responsável por listar todos os cursos e todos os descontos dos convenios
							 * Deve ser feito requisições do tipo GET, sem parâmetros:
							 * http://{host}/convenio/wsc-convenio/desconto-convenio
							 *
							 * Retornos:
							 * 1- {'sucesso': true, 'ecmProduto': lista de produtos dividida por tipo com valores e descontos}
							 *
							 * */
							descontoConvenio : function () {
								var promise = $http({
									method: 'GET',
									url: Config.baseUrl+'/convenio/wsc-convenio/desconto-convenio'
								});

								return promise.then( function(res){
									if((res && res.status == 200 && res.data)&&(res.data.retorno))
										return res.data.retorno;
									return false;
								}, function(res){ return res });
							}

						};

				return sdo;
				
			  	// private functions
				function handleSuccess(res) {
				    return res.data.retorno;
				}

				function handleError(error) {
				    return function () {
				        return { success: false, error: error };
				    };
				}
			}]);
}());
