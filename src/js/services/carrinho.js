(function () {
	'use strict';

	angular
		.module('QiSatApp')
		.factory("carrinhoServive", ['$http', "$q", '$timeout', '$window', 'Config', '$location', '$filter', 'authService',
			function ($http, $q, $timeout, $window, Config, $location, $filter, authService) {

				var carrinho = false, itens, valorTotal = 0, promoTheend = [], hasTrilha = false,
					filterLimitName = $filter('limitName'), transacao = null, cupom, load,
					isProposta = false, isRenovacao = false, contractOnline = false, contractEberick = false, contractQibuilder = false, contractLab1 = false, contractLab2 = false;

				(load = function () {

					if (!carrinho){
						carrinho = window.localStorage.getItem('carrinho');
					}

					if (!carrinho && ($location.path() && ($location.path().indexOf('/carrinho') == 0))){
						carrinho = true;
					}

					if ($location.path().indexOf('/proposta') >= 0){
						isProposta = true;
					}else{

						if(isProposta === true){
							destroyCarrinho();
						}

						isProposta = false;
					}
	
					if ($location.path().indexOf('/renovacao') >= 0){
						isRenovacao = true;
					}else{

						if(isRenovacao === true){
							destroyCarrinho();
						}

						isRenovacao = false;
					}

				}).call(this);

				function checkCarrinho() {
					return (carrinho) ? true : false;
				}

				function checkItens() {
					return (itens && itens.length) ? true : false;
				}

				function checkPromocaoTheend() {
					return (promoTheend && promoTheend.length) ? true : false;
				}

				function getPromocaoTheend() {
					return promoTheend;
				}

				function getTrilha() {
					return hasTrilha;
				}

				function showContract(tipo) {
					if (tipo == 54)
						return contractLab1;
					else if (tipo == 55)
						return contractLab2;
					else if (tipo == 56)
						return contractEberick;
					else if (tipo == 57)
						return contractQibuilder;
					else if (tipo == 2)
						return contractOnline;
					else
						return false;
				}

				function getItens() {
					return itens;
				}

				
				function checkProposta() {
					return isProposta;
				}

				function checkRenovacao() {
					return isRenovacao;
				}

				function getValorTotal() {
					return valorTotal;
				}

				function getTransacao() {
					return transacao;
				}

				function setTransacao(value) {
					var valor;
					if (value.status == 'aguardando_pagamento') {
						value.data_envio = $filter('date')(value.data_envio * 1000, 'dd/MM/yyyy');
						if (value.numero_parcelas > 1) {
							valor = value.valor / value.numero_parcelas;
							valor = $filter('currency')(valor, 'R$');
						} else
							valor = $filter('currency')(value.valor, 'R$');
						value.parcelas = value.numero_parcelas + 'x de ' + valor;
					}

					transacao = value;
				}

				function setItens(value) {
					itens = value;
					valorTotal = 0;
					promoTheend = [];
					hasTrilha = false;
					contractOnline = false;
					contractEberick = false;
					contractQibuilder = false;
					contractLab1 = false;
					contractLab2 = false;
					transacao = null;
					cupom = null;
					var datenow = moment(), datapromo, promocao, tipo;

					if (value) {
						cupom = itens.find(function (val) { return val.ecm_cupom });
						cupom = (cupom && cupom.ecm_cupom) ? cupom.ecm_cupom : false;

						itens.map(function (item) {
							datapromo = null;
							promocao = null;

							item.precoFormat = $filter('currency')(item.valor_produto_desconto, 'R$');
							item.valorFormat = $filter('currency')(item.valor_produto, 'R$');
							if (item.ecm_promocao) {

								if (item.ecm_promocao.descontovalor)
									item.valorPromocao = item.ecm_promocao.descontovalor;
								else if (item.ecm_promocao.descontoporcentagem)
									item.valorPromocao = (item.ecm_promocao.arredondamento == 'true') ? Math.round(item.valor_produto * (item.ecm_promocao.descontoporcentagem / 100)) : (item.valor_produto * (item.ecm_promocao.descontoporcentagem / 100));

								item.valorPromocaoFormat = $filter('currency')(item.valorPromocao, 'R$');
								item.promocaoDateend = $filter('date')(item.ecm_promocao.datafim * 1000, 'dd/MM/yyyy');
							}

							if (item.ecm_cupom) {
								if (item.ecm_cupom.descontovalor)
									item.valorCupom = item.ecm_cupom.descontovalor;
								else if (item.ecm_cupom.descontoporcentagem) {
									if ((item.ecm_cupom.descontosobretabela == 'true'))
										item.valorCupom = item.valor_produto * (item.ecm_cupom.descontoporcentagem / 100);
									else
										item.valorCupom = item.valorPromocao ? (item.valor_produto - item.valorPromocao) * (item.ecm_cupom.descontoporcentagem / 100) : (item.valor_produto) * (item.ecm_cupom.descontoporcentagem / 100);

									if (item.ecm_cupom.arredondamento == 'true')
										item.valorCupom = Math.round(item.valorCupom);
								}

								item.valorCupomFormat = $filter('currency')(item.valorCupom, 'R$');
							}

							item.total = item.quantidade * item.valor_produto_desconto;
							valorTotal = valorTotal + item.total;
							item.totalFormat = $filter('currency')(item.total, 'R$');
							item.nomeLimit = filterLimitName(item.ecm_produto.nome, 35);
							item.nome = item.ecm_produto.nome;

							if (item.ecm_produto && item.ecm_produto.categorias) {
								tipo = item.ecm_produto.categorias.find(function (tipo) { return tipo.id == 33 });
								if (tipo) { // Item Séries
									item.modalidade = tipo.nome;
									item.isSerie = true;
									contractOnline = true;
								} else {
									tipo = item.ecm_produto.categorias.find(function (tipo) { return tipo.id == 41 });
									if (tipo) { // Curso Série
										item.modalidade = tipo.nome;
										item.isSerie = true;
										contractOnline = true;
									} else {
										tipo = item.ecm_produto.categorias.find(function (tipo) { return tipo.id == 42 });
										if (tipo) { // A Certificado
											tipo = item.ecm_produto.categorias.find(function (tipo) { return tipo.id == 44 });
											if (tipo) {
												item.packCert = true;
											} else {
												item.testCert = true;
											}
										} else {
											tipo = item.ecm_produto.categorias.find(function (tipo) { return tipo.id == 48 });
											if (tipo) { // Produto AltoQi
												item.modalidade = tipo.nome;
												item.isAltoQi = true;
												tipo = item.ecm_produto.categorias.find(function (tipo) { return tipo.id == 56 });
												if (tipo) { // FASE I
													contractEberick = true;
													item.isEberick = true;
												} else {
													tipo = item.ecm_produto.categorias.find(function (tipo) { return tipo.id == 57 });
													if (tipo) { // FASE II 
														contractQibuilder = true;
														item.isQibuilder = true;
													}
												}
											} else {
												tipo = item.ecm_produto.categorias.find(function (tipo) { return tipo.id == 47 });
												if (tipo) { // Fase Trilha
													item.modalidade = tipo.nome;
													item.isSetup = true;
													hasTrilha = true;

													tipo = item.ecm_produto.categorias.find(function (tipo) { return tipo.id == 54 });
													if (tipo) { // FASE I
														contractLab1 = true;
														item.isLab1 = true;
													} else {
														tipo = item.ecm_produto.categorias.find(function (tipo) { return tipo.id == 55 });
														if (tipo) { // FASE II 
															contractLab2 = true;
															item.isLab2 = true;
														}
													}

												} else {
													tipo = item.ecm_produto.categorias.find(function (tipo) { return tipo.id == 17 })
													if (tipo) { // Pacotes
														item.modalidade = tipo.nome;
														item.isPack = true;
														contractOnline = true;
													} else {
														tipo = item.ecm_produto.categorias.find(function (tipo) { return tipo.id == 40 });
														if (tipo) { // PALESTRAS
															item.modalidade = tipo.nome;
															item.isLecture = true;
															contractOnline = true;
														} else {
															tipo = item.ecm_produto.categorias.find(function (tipo) { return tipo.id == 12 });
															if (tipo) { // Presenciais Individuais
																item.modalidade = tipo.nome;
																item.isIndividual = true;
																contractOnline = true;
															} else {
																tipo = item.ecm_produto.categorias.find(function (tipo) { return tipo.id == 10 });
																if (tipo) { // Presencial
																	item.modalidade = tipo.nome;
																	item.isClassroom = true;
																	contractOnline = true;
																} else {
																	tipo = item.ecm_produto.categorias.find(function (tipo) { return tipo.id == 2 });
																	if (tipo) { // A Dinstancia
																		item.modalidade = tipo.nome;
																		item.isOnline = true;
																		contractOnline = true;
																	} else {
																		tipo = item.ecm_produto.categorias.find(function (tipo) { return tipo.id == 16 });
																		if (tipo) { // Prazo Extra
																			item.modalidade = tipo.nome;
																			contractOnline = true;
																			item.isExtra = true;
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}

							if ((item.isSetup || item.isAltoQi) && item.ecm_produto) {
								item.precoParcelado = $filter('currency')(item.ecm_produto.valor_parcelado, 'R$');
								item.parcelas = item.ecm_produto.parcelas;
							}

							if (item.isAltoQi && item.ecm_carrinho_item_ecm_produto_aplicacao) {
								
								if(item.isEberick){
									item.modulos = [];
								}

								if(item.isQibuilder){
									item.apps = [];
								}

								item.ecm_carrinho_item_ecm_produto_aplicacao.map(function (iApp) {
									if(iApp.ecm_produto_ecm_aplicacao && iApp.ecm_produto_ecm_aplicacao.ecm_produto_aplicacao){
										if(item.isEberick && iApp.ecm_produto_ecm_aplicacao.ecm_produto_aplicacao.tecnologia == 'MODULO'){
											item.modulos.push(iApp.ecm_produto_ecm_aplicacao.ecm_produto_aplicacao);
										}

										if(item.isQibuilder && iApp.ecm_produto_ecm_aplicacao.ecm_produto_id != item.ecm_produto_id){
											item.apps.push(iApp.ecm_produto_ecm_aplicacao.ecm_produto_aplicacao);
										}
									}

								});
							}

							if (item.ecm_promocao) {
								item.precoParcelado = $filter('currency')((item.valorTotal / item.parcelas), 'R$');
								datapromo = moment.unix(item.ecm_promocao.datafim);
								if (datapromo.diff(datenow, 'hours') < 24) {
									promocao = promoTheend.find(function (promo) { return promo.id == item.ecm_promocao.id });
									item.ecm_promocao.dataTheend = datapromo.diff(datenow, 'seconds');
									if (!promocao) promoTheend.push(item.ecm_promocao);
								}
							}
						});

					}
				}

				function saveCarrinho() {
					carrinho = true;
					window.localStorage.setItem('carrinho', carrinho);
				}

				function destroyCarrinho() {
					valorTotal = 0;
					carrinho = false;
					itens = null;
					transacao = null;
					cupom = null;
					window.localStorage.removeItem('carrinho');
				}

				function validCupom(cupom) {
					var headers = (authService.isLogged()) ? { 'Authorization': Config.Authorization + " " + authService.getToken(), 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
					var deferred = $q.defer(), promise;

					promise = $http({
						method: 'GET',
						loading: true,
						url: Config.url.base + '/cupom/validar/' + cupom,
						dataType: 'jsonp',
						headers: headers,
						withCredentials: true

					});

					return promise.then(function (res) {
						return (res && res.data && res.data.retorno) ? res.data.retorno : false;
					}, function (res) {
						deferred.resolve(function (res) { return false });
						deferred.reject(function (res) { return false });
						return deferred.promise;
					});

				}

				function getCupom() {
					var deferred = $q.defer();

					return $timeout(function () {
						if (cupom)
							return cupom.chave;
						else
							return '';
					});
				}

				function addItem(data) {

					var headers = (authService.isLogged()) ? { 'Authorization': Config.Authorization + " " + authService.getToken() } : {};

					var promise = $http({
						method: 'post',
						loading: true,
						url: Config.url.base + '/carrinho/wsc-carrinho/add',
						data: data,
						headers: headers,
						withCredentials: true
					});

					return promise.then(function (res) {
						if (res.status == 200 && res.data && res.data.retorno && res.data.retorno.sucesso) {
							saveCarrinho();
							setItens(res.data.retorno.carrinho.ecm_carrinho_item);
							return itens;
						} else
							return false;
					}, function (res) {
						return res;
					});
				}

				function getProposta(id) {
					var promise;
					var headers = (authService.isLogged()) ? { 'Authorization': Config.Authorization + " " + authService.getToken() } : {};
					isProposta = true;

					promise = $http({
						method: 'post',
						url: Config.url.base + '/carrinho/wsc-carrinho/get-proposta',
						data: { 'proposta': id },
						headers: headers,
						withCredentials: true
					});

					return promise.then(function (res) {
						if (res && res.status == 200 && res.data && res.data.retorno) {

							if (res.data.retorno.carrinho && res.data.retorno.carrinho.ecm_carrinho_item && res.data.retorno.carrinho.status != "Finalizado") {
								setItens(res.data.retorno.carrinho.ecm_carrinho_item);
								saveCarrinho();
							}
							if (!res.data.retorno.sucesso && res.data.retorno.transacao)
								setTransacao(res.data.retorno.transacao);

							return res.data.retorno;
						} else
							destroyCarrinho();

						return false;
					}, function (res) {
						destroyCarrinho();
						return false;
					});
				}

				function getCarrinho() {

					var headers = (authService.isLogged()) ? { 'Authorization': Config.Authorization + " " + authService.getToken() } : {};

					var promise = $http({
						method: 'post',
						url: Config.url.base + '/carrinho/wsc-carrinho/listar',
						headers: headers,
						withCredentials: true
					});

					return promise.then(function (res) {
						if (res && res.status == 200 && res.data && res.data.retorno && res.data.retorno.carrinho && res.data.retorno.carrinho.ecm_carrinho_item && res.data.retorno.carrinho.status != "Finalizado") {
							setItens(res.data.retorno.carrinho.ecm_carrinho_item);
							saveCarrinho();
							if (!res.data.retorno.sucesso && res.data.retorno.transacao)
								setTransacao(res.data.retorno.transacao);

							return res.data.retorno;
						} else
							destroyCarrinho();

						return false;
					}, function (res) {
						destroyCarrinho();
						return res;
					});

				}

				function cancelarTransacao() {

					var headers = (authService.isLogged()) ? { 'Authorization': Config.Authorization + " " + authService.getToken() } : {};

					var promise = $http({
						method: 'get',
						loading: true,
						url: Config.url.base + '/carrinho/wsc-carrinho/cancelar-transacao',
						headers: headers,
						withCredentials: true
					});

					return promise.then(function (res) {
						if (res && res.status == 200 && res.data && res.data.retorno)
							return res.data.retorno;
						return false;
					}, function (res) {
						return res;
					});
				}

				function getFormas(data) {

					var headers = (authService.isLogged()) ? { 
						'Content-Type': 'application/json',
						'Authorization': Config.Authorization + " " + authService.getToken() 
					} : {
						'Content-Type': 'application/json',
					};

					var promise = $http({
						method: 'POST',
						loading: true,
						url: Config.url.base + '/forma-pagamento/wsc-forma-pagamento/formas',
						data: data,
						/*headers: {
							'Content-Type': 'application/json',
							'Authorization': Config.Authorization + " " + authService.getToken()
						},*/
						headers: headers,
						withCredentials: true
					});

					return promise.then(function (res) {
						var formas = false;
						if (res && res.status == 200 && res.data && res.data.retorno && res.data.retorno.sucesso && res.data.retorno.formas) {

							formas = Object.keys(res.data.retorno.formas).map(function (key) {
								var forma, operadoras, tipos, parcelas;

								forma = res.data.retorno.formas[key];
								forma.index = key;

								if (forma.operadoras) {
									operadoras = Object.keys(forma.operadoras).map(function (o) {
										var operadora = { index: o, img: forma.operadoras[o] };
										return operadora;
									});
									forma.operadoras = operadoras;
								}

								if (forma.tipos) {
									tipos = Object.keys(forma.tipos).map(function (t) {
										var tipo = { index: t, img: forma.tipos[t] };
										return tipo;
									});
									forma.tipos = tipos;
								}

								if (forma.parcelas) {
									parcelas = Object.keys(forma.parcelas).map(function (p) {
										var parcela = { qtd: p };
										parcela.valor = $filter('currency')(forma.parcelas[p], 'R$');
										return parcela;
									});
									forma.parcelas = parcelas;
								}

								return forma;

							});

							return formas;
						} else {
							return false;
						}
					});
				}

				function setFormasPagamentos(data) {

					var promise = $http({
						method: 'POST',
						loading: true,
						url: Config.url.base + '/forma-pagamento/wsc-forma-pagamento/requisicao',
						data: data,
						dataType: 'jsonp',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': Config.Authorization + " " + authService.getToken()
						},
						withCredentials: true
					});

					return promise.then(function (res) {
						if (res.status == 200 && res.data && res.data.retorno && res.data.retorno.sucesso)
							return res.data.retorno;
						else if (res && res.data && res.data.retorno)
							return res.data.retorno;
						else
							return res;
					}, function (res) {
						return res;
					});
				}

				function getVenda(id) {

					var headers = { 'Content-Type': 'application/json' };
					if(authService.getToken()){ // IF logado 
						headers.Authorization = Config.Authorization + " " + authService.getToken();
					}

					var promise = $http({
						method: 'POST',
						loading: true,
						url: Config.url.base + '/vendas/wsc-minhas-compras/get/' + id,
						dataType: 'jsonp',
						headers: headers,
						withCredentials: true
					});

					return promise.then(function (res) {
						if (res.status == 200 && res.data && res.data.retorno && res.data.retorno.sucesso)
							return res.data.retorno;
						else
							return res;
					}, function (res) {
						return res;
					});
				}

				function removeItem(data) {

					var promise = $http({
						method: 'post',
						loading: true,
						url: Config.url.base + '/carrinho/wsc-carrinho/remove',
						data: data,
						withCredentials: true

					});

					return promise.then(function (res) {
						if (res && res.status == 200 && res.data && res.data.retorno && res.data.retorno.carrinho && res.data.retorno.carrinho.ecm_carrinho_item) {
							setItens(res.data.retorno.carrinho.ecm_carrinho_item);
							return itens;
						} else {
							destroyCarrinho();
							return res;
						}
					});
				}

				var sdo = {
					addItem: addItem,
					removeItem: removeItem,
					getItens: getItens,
					checkItens: checkItens,
					destroyCarrinho: destroyCarrinho,
					checkCarrinho: checkCarrinho,
					getCarrinho: getCarrinho,
					cancelarTransacao: cancelarTransacao,
					getFormas: getFormas,
					getVenda: getVenda,
					setFormasPagamentos: setFormasPagamentos,
					getValorTotal: getValorTotal,
					checkPromocaoTheend: checkPromocaoTheend,
					getPromocaoTheend: getPromocaoTheend,
					hasTrilha: getTrilha,
					showContract: showContract,
					getProposta: getProposta,
					checkProposta: checkProposta,
					checkRenovacao : checkRenovacao,
					getTransacao: getTransacao,
					validCupom: validCupom,
					getCupom: getCupom, 
					load : load
				};

				return sdo;

			}]);
}());