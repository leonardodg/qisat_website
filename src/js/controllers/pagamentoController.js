(function () {

	angular
		.module('QiSatApp')
		.controller('pagamentoController', ['__env', '$scope', '$location', 'authService', '$modal', '$timeout', '$window', '$controller', 'carrinhoServive', 'formasPagamentos', 'Authenticated',
			function (env, scope, $location, authService, $modal, $timeout, $window, $controller, carrinhoServive, formasPagamentos, Authenticated) {

				var modalController = $controller('modalController');
				var vm = this;

				vm.environment = env.environment;

				vm.anoVencimento = ['2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'];
				vm.mesVencimento = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

				if (formasPagamentos) {
					formasPagamentos.map(function (forma) {

						if (forma.tipo && forma.tipo.indexOf('cartao') >= 0)
							forma.isCard = true;

						if (forma && forma.operadoras) {
							forma.operadoras = forma.operadoras.map(function (op) {
								if (op.img && op.img.nome)
									op.img.nome = op.img.nome.replace('.png', '').toUpperCase();
								if (op.img && op.img.src)
									op.img.src = op.img.src.replace('upload/https:', 'https:');
								return op;
							});
						}

						if (forma.parcelas && forma.parcelas.length) {
							forma.parcelas.map(function (parcela) {
								parcela.label = parcela.qtd + 'x de ' + parcela.valor;
							});
						}
					});

					vm.formasPagamentos = formasPagamentos.reverse();

					if(vm.formasPagamentos.length == 1 && vm.formasPagamentos[0].dataname=='api'){
						vm.forma = vm.formasPagamentos[0];
					}
				}

				vm.selectForma = function (forma, pagamento) {
					
					vm.pagamento = pagamento;
					vm.forma = forma;
					if (vm.forma && vm.forma.parcelas && vm.forma.parcelas.length) {
						vm.parcelas = vm.forma.parcelas;
						vm.nparcelas = null;
					}

					vm.error = false;
				}

				vm.classOperadora = function(op) {

					var opEnable = ['Visa','MasterCard','American Express','Diners Club','Discover','JCB','Elo'];
					var notvalid = opEnable.find(function(el){ return op == el });

					return {
							'card-number': !op, 
							'visa': (op == 'Visa'),
							'master': (op == 'MasterCard'),
							'amex' : (op =='American Express'),
							'dinners' : (op =='Diners Club'),
							'discover' : (op == 'Discover'),
							'jcb' : (op =='JCB'),
							'elo' : (op =='Elo'),
							'card-notvalid': (notvalid) ? false : true
						 }
				}

				if (Authenticated) {

					vm.user = authService.getUser();
					if (vm.user && (!vm.user.email || !vm.user.numero)) {

						if(carrinhoServive.checkRenovacao()){
							modalController.update('/renovacao-licencas-altoqi/pagamento');
							$location.path('/renovacao-licencas-altoqi/');
						}else{
							modalController.update('/carrinho/pagamento');
							$location.path('/carrinho/');
						}
						
					}

					vm.modalContrato = function (tipo) {
						var template = '/views/modal-contrato.html';

						if (tipo == 56)
							template = '/views/modal-contrato-eberick-2019.html';
						else if (tipo == 57)
							template = '/views/modal-contrato-qibuilder-2019.html';

						var modalInstance = $modal.open({
							templateUrl: template,
							controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
								$scope.cancel = function () {
									$modalInstance.close();
								};
								var itens = carrinhoServive.getItens(), online = [], presencial = [];

								if (vm.user) $scope.nome = vm.user.firstname + ' ' + vm.user.lastname;

								$scope.datanow = moment().format('D [de] MMMM [de] YYYY');

								if (itens && itens.length) {
									itens.map(function (item) {
										var dados = { id: item.id };
										if (item.ecm_produto) {

											if (item.ecm_produto.enrolperiod) {
												dados.enrolperiod = item.ecm_produto.enrolperiod.toString();
												dados.enrolperiod = dados.enrolperiod + ' (' + extenso(dados.enrolperiod) + ') ' + ' Dias';
											}

											dados.modalidade = item.modalidade;
											dados.nome = item.ecm_produto.nome;

											if (item.ecm_produto.mdl_course) {
												dados.courses = [];
												item.ecm_produto.mdl_course.map(function (course) {
													var aux = { id: course.id };
													if (course.fullname) aux.nome = course.fullname;
													if (course.timeaccesssection) {
														aux.time = course.timeaccesssection.toString();
														aux.time = aux.time + ' (' + extenso(aux.time) + ') ' + ' Horas';
													}
													dados.courses.push(aux);
												});
											}

											if (item.isOnline || item.isLecture || item.isExtra) {
												dados.isOnline = true;
												online.push(dados);
											} else if ((item.isSerie || item.isPack) && !item.isSetup) {
												dados.isPack = true;
												online.push(dados);
											} else if (item.isClassroom) {
												item.isClassroom = true;

												if (item.estado && item.cidade)
													dados.local = item.cidade + ' - ' + item.estado;

												if (item.datas && item.datas.length) {
													dados.datas = [];
													item.datas.map(function (data) {
														dados.datas.push(moment.unix(data.data_inicio).format('DD/MM/YYYY'));
													});
												}
												presencial.push(dados);
											}
										}
									});

									$scope.online = online;
									$scope.presencial = presencial;
								}
							}]
						});
					}

					vm.nextPagamento = function (form) {
						vm.submitted = true;
						var data = {}, tipoPagamento;

						if (vm.pagamento && (vm.nparcelas || ((vm.forma.tipo == 'boleto' && !vm.nparcelas) || (vm.forma.tipo == 'checkout' && !vm.nparcelas))) && (((vm.contratoOnline === true && carrinhoServive.showContract(2)) || ((vm.contratoOnline === false || typeof vm.contratoOnline == 'undefined') && carrinhoServive.showContract(2) === false)) && ((vm.contratoEberick === true && carrinhoServive.showContract(56)) || ((vm.contratoEberick === false || typeof vm.contratoEberick == 'undefined') && carrinhoServive.showContract(56) === false)) && ((vm.contratoQiBuilder === true && carrinhoServive.showContract(57)) || ((vm.contratoQiBuilder === false || typeof vm.contratoQiBuilder == 'undefined') && carrinhoServive.showContract(57) === false)))) {
							if (vm.forma.tipo == 'cartao_recorrencia' || vm.forma.dataname == 'api') {
								if (!vm.cartao || !vm.cartao.nome || !vm.cartao.numero || !vm.cartao.mesSelect || !vm.cartao.anoSelect || ((!vm.contratoOnline && carrinhoServive.showContract(2)) || (!vm.contratoEberick && carrinhoServive.showContract(56)) || (!vm.contratoQiBuilder && carrinhoServive.showContract(57)))) {
									return modalController.alert({ error: true, main: { title: "Verificar campos obrigatórios!" } });
								} else {
									data.cartao = vm.cartao;
								}
							}

							vm.loading = true;
							vm.error = false;
							data.contrato = 1;
							data.operadora = parseInt(vm.pagamento);
							tipoPagamento = vm.formasPagamentos.find(function (forma) { return forma.operadoras && forma.operadoras.find(function (op) { return op.index == vm.pagamento }) });
							// melhorar solução para quando forma de pogamento possuir mais de um tipo ativo
							if (tipoPagamento && tipoPagamento.tipos)
								data.tipoPagamento = parseInt(tipoPagamento.tipos[0].index);
							data.valorParcelas = (vm.nparcelas) ? parseInt(vm.nparcelas.qtd) : 1;

							carrinhoServive.getCarrinho()
								.then(function (res) {
									if (res && res.carrinho && res.carrinho.ecm_carrinho_item) {
										var produtos = [], itens = res.carrinho.ecm_carrinho_item;
										if (itens && itens.length) {
											itens.map(function (item) {
												if (!item.isSetup)
													produtos.push({ produto: item.ecm_produto_id, quantidade: item.quantidade, valor: item.valor_produto_desconto });
											});
											data.itens = produtos;
											carrinhoServive.setFormasPagamentos(data).then(function (res) {
												if (res.sucesso) {
													vm.loading = false;
													if (res.venda && (tipoPagamento.tipo == 'cartao_recorrencia' || tipoPagamento.tipo == 'boleto' || tipoPagamento.dataname == 'api')) {
														if(carrinhoServive.checkRenovacao()){
															$location.path('/renovacao-licencas-altoqi/confirmacao/' + res.venda);
														}else{
															$location.path('/carrinho/confirmacao/' + res.venda);
														}
													} else if (res.url) {
														vm.redirect = res.url;

														$timeout(function () {
															$window.location.href = res.url;
														}, 10000);
													}
												} else {
													vm.loading = false;

													if (res.mensagem)
														modalController.alert({ error: true, main: { title: "Falha no Pagamento!", subtitle: res.mensagem } });
													else
														modalController.alert({ error: true, main: { title: "Falha no Pagamento!", subtitle: "Entre em contato com a nossa Central de Inscrições - (48) 3332-5000" } });

												}
											}, function () {
												vm.loading = false;
												modalController.alert({ error: true, main: { title: "Falha no sistema de Pagamento!", subtitle: "Entre em contato com a nossa Central de Inscrições - (48) 3332-5000" } });
											});
										}
									}
								}, function () {
									vm.loading = false;
									modalController.alert({ error: true, main: { title: "Falha no sistema de Pagamento!", subtitle: "Entre em contato com a nossa Central de Inscrições - (48) 3332-5000" } });
								});
						}else{
							modalController.alert({ error: true, main: { title: "Verificar campos obrigatórios!" } });
						}
					}

					vm.cancelTransacao = function () {
						carrinhoServive.cancelarTransacao().then(function (res) {
							$window.location.reload();
						});
					}

				} else {
					$location.path('/carrinho');
				}
			}]);
})();
