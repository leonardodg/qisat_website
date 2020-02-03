(function () {

	angular
		.module('QiSatApp')
		.controller('modalController', ['$modal', '$q', '$controller', '$document', 'authService', 'carrinhoServive', '$http', 'Config', '$location', 
			function ($modal, $q, $controller, $document, authService, carrinhoServive, $http, Config, $location) {
				var vm = this;

				vm.termo = function () {
					var modalInstance = $modal.open({
						templateUrl: '/views/modal-termo-de-uso.html',
						controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
							$scope.cancel = function () {
								$modalInstance.close();
							};
						}]
					});
				}

				vm.politica = function () {
					var modalInstance = $modal.open({
						templateUrl: '/views/modal-politica.html',
						controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
							$scope.cancel = function () {
								$modalInstance.close();
							};
						}]
					});
				}

				vm.trilha = function (produto) {

					var auth = authService.Authenticated();

					function checkCPF() {
						var modalInstance;

						function callbackTrilha() {
							var items = carrinhoServive.getItens();
							if(items.length && vm.isPagarme){
								vm.pagarme();
							}else{
								modalInstance = $modal.open({
									templateUrl: '/views/compra-trilha.html',
									windowClass: 'modalTrilha large',
									controller: 'trilhaController as trilhaCtr',
									resolve: {
										produto: function () {
											return produto;
										}
									}
								});
							}
						}

						var user = authService.getUser();
						if (user && (!user.email || !user.numero))
							vm.update(false, callbackTrilha);
						else
							callbackTrilha();
					}

					if (auth === true) {
						checkCPF();
					} else if (auth === false) {
						vm.login('/carrinho/', false, checkCPF);
					} else {
						auth.then(function (res) {
							if (res === true) {
								checkCPF();
							} else {
								vm.login('/carrinho/', false, checkCPF);
							}
						});
					}

				}

				vm.call = function () {
					var modalInstance = $modal.open({
						windowClass: 'call',
						templateUrl: '/views/modal-call.html',
						controller: ['$scope', '$modalInstance', 'QiSatAPI', 'authService',
							function ($scope, $modalInstance, QiSatAPI, authService) {

								var user = authService.getUser();
								var regex = /\(([^)]+)\)/, operadora, aux, phone;
								$scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,6}$/;
								$scope.submitted = false;

								$scope.cancel = function () {
									$modalInstance.close();
								};

								if (user) {
									$scope.dados = {
										nome: user.firstname + ' ' + user.lastname,
										email: user.email
									};

									aux = user.phone1.match(regex);
									phone = user.phone1.replace(/[^\d]+/g, '');
									if (aux && aux.length && aux[1])
										$scope.dados.operadora = aux[1];
									if (phone.length <= 9)
										$scope.dados.telefone = phone;
									else
										$scope.dados.telefone = phone.substr(2);
								}

								$scope.solicitarContato = function (data, callForm) {

									var dados = { empresa: "QiSat", origem: "Site QiSat", categoria: "Ligamos Para Voce" };
									dados.user_dados = angular.copy(data);

									if (user)
										dados.userid = user.id;

									if (callForm && callForm.$valid) {
										$scope.loading = true;
										dados.user_dados.telefone = '(' + data.operadora + ") " + data.telefone;

										QiSatAPI.newRepasse(dados)
											.then(function (res) {
												$scope.enviado = true;
												$scope.loading = false;
											}, function (res) {
												$scope.enviado = true;
												$scope.loading = false;
											});

									}
								};
							}]
					});
				}

				vm.questionnaire = function (question) {
					var modalInstance = $modal.open({
						windowClass: 'call',
						templateUrl: '/views/modal-question.html',
						controller: ['$window', '$scope', '$modalInstance', 'Config', 'authService',
							function ($window, $scope, $modalInstance, Config, authService) {
								var respostas;
								$scope.submitted = false;
								$scope.resp = [];
								$scope.question = question.perguntas;

								$scope.cancel = function () {
									$modalInstance.close();
								};

								$scope.send = function (resp, form) {
									$scope.submitted = true;
									respostas = {};

									if (resp && resp.length) {
										resp.map(function (val, i) { respostas[i] = val.id });

										authService.courseQuestion({
											wstoken: Config.tokens.moodleRespond,
											moodlewsrestformat: "json",
											wsfunction: "web_service_responder",
											courseid: question.curso,
											userid: question.user,
											questionnaire: question.id,
											respostas: JSON.stringify(respostas)
										}).then(function (res) {
											$modalInstance.close();
											if (res && res.data && res.data.sucesso) {
												vm.alert({ success: true, main: { subtitle: "Agradecemos sua participação", title: 'Bons estudos!' } });
											}
											$window.location.href = question.url;
										});

									}
								};
							}]
					});
				}

				vm.showZopim = function (show, wait) {
					var body = angular.element(document).find('body');

					show = (show === false) ? false : true;
					wait = (wait === false) ? false : true;

					if (wait) body.addClass('wait');

					function load() {
						var deferred = $q.defer();
/* jshint expr: true */
						window.$zopim || (function (d, s, undefined) {

							var z = window.$zopim = function (c) { z._.push(c) }, $ = z.s =
								d.createElement(s), e = d.getElementsByTagName(s)[0];
							z.set = function (o) {
								z.set.
									_.push(o)
							};
							z._ = [];
							z.set._ = [];
							$.async = !0;
							$.setAttribute("charset", "utf-8");
							$.src = "https://v2.zopim.com/?2jhFplrC6wQCc6t1tRCcVV3LZTuli01D";
							z.t = (function () { return Number(new Date()); }).call();
							$.type = "text/javascript";
							e.parentNode.insertBefore($, e);
						}).call(window, typeof window !== "undefined" ? window.document : $document, "script");

						window.$zopim(function () {
							if (typeof (window.$zopim.livechat) == 'object') {
								window.$zopim.livechat.theme.setColor('#1B5485');
								window.$zopim.livechat.theme.reload(); // apply new theme settings
								window.$zopim.livechat.hideAll();
								deferred.resolve();
							} else {
								result.reject();
							}
						});

						return deferred.promise;
					}

					return load().then(function () {
						var user = authService.getUser();
						var chave;
						$zopim.livechat
							.setOnConnected(function () {
								$zopim.livechat.departments.setVisitorDepartment(111831);

								if (user) {
									chave = user.idnumber ? ' - ' + user.idnumber : '';

									$zopim.livechat.set({
										language: 'pt-br',
										name: user.firstname + ' ' + user.lastname + chave,
										email: user.email,
										phone: user.phone1
									});
								}

								if (wait) body.removeClass('wait');
								if (show) window.$zopim.livechat.window.show();
							});
					});
				}

				/*

				@paramts msgs = object 
								Attrs : 
									header = object 
										Attrs :
											title = string
											subtitle = string

									main = object 
										Attrs :
											title = string
											subtitle = string

									success = boolean


				*/
				vm.alert = function (msgs) {
					var modalInstance = $modal.open({
						windowClass: 'call',
						templateUrl: '/views/modal-alert.html',
						controller: ['$scope', '$modalInstance',
							function ($scope, $modalInstance) {
								$scope.msgs = msgs;

								$scope.cancel = function () {
									$modalInstance.close();
								};
							}]
					});
				}

				vm.interesse = function (course) {
					var modalInstance = $modal.open({
						windowClass: 'interesse',
						templateUrl: '/views/modal-interesse.html',
						controller: ['$scope', '$modalInstance', 'QiSatAPI', 'authService',
							function ($scope, $modalInstance, QiSatAPI, authService) {

								var user = authService.getUser();
								var dados = { empresa: "QiSat", origem: "Site QiSat", categoria: "Interesse Curso Presencial" };

								if (user)
									dados.userid = user.id;

								$scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,6}$/;
								$scope.submitted = false;

								$scope.cancel = function () {
									$modalInstance.close();
								};

								if (course.isClassroom)
									$scope.tipo = 'presencial';
								else if (course.isIndividual)
									$scope.tipo = 'individual';
								else if (course.isClass)
									$scope.tipo = 'turma';

								$scope.submit = function (data, form) {
									$scope.submitted = true;

									if (form && form.$valid) {

										dados.user_dados = {
											email: data.email,
											nome: data.nome,
											telefone: '(' + data.operadora + ') ' + data.telefone,
											curso: course.nome || course.titulo || course.curso,
											categoria: course.modalidade,
											curso_tipo: $scope.tipo
										};

										if (course.datauf)
											dados.user_dados.turma = course.datauf;

										$scope.loading = true;

										QiSatAPI.newRepasse(dados)
											.then(function (res) {
												$scope.enviado = true;
												$scope.loading = false;
											}, function (res) {
												$scope.enviado = true;
												$scope.loading = false;
											});

									}
								}
							}]
					});
				}

				vm.update = function (urlNext, callback) {
					var user = authService.getUser(), modalInstance;

					if (user && (!user.email || !user.numero)) {

						modalInstance = $modal.open({
							windowClass: 'interesse',
							templateUrl: '/views/modal-update.html',
							controller: ['$scope', '$modalInstance', 'QiSatAPI', '$location',
								function ($scope, $modalInstance, QiSatAPI, $location) {

									$scope.dados = {};
									$scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,6}$/;
									$scope.submitted = false;
									$scope.zopim = false;

									$scope.cancel = function () {
										$modalInstance.close();
									};

									if (!user.email)
										$scope.getEmail = true;

									if (!user.numero)
										$scope.getCpf = true;

									$scope.showZopim = function () {
										vm.showZopim(false).then(function () {
											$zopim.livechat.say('Solicito ajuda para cadastra/atualizar CPF ou CNPJ: ' + $scope.dados.cpfcnpj);
											$zopim.livechat.window.show();
										});
									};

									$scope.remember = function (email) {
										var data = { email: email };
										$scope.msgRemember = '';
										QiSatAPI.remember(data)
											.then(function (response) {
												if (response && response.data && response.data.retorno && response.data.retorno.sucesso)
													$scope.msgRemember = "Lembrete de senha enviado com Sucesso!";
												else
													$scope.msgRemember = "Falha no Envio da Mensagem.";

											}, function (response) {
												$scope.msgRemember = "Falha no Envio da Mensagem.";
											});
									};

									$scope.submit = function (data, form) {
										var newdata = {}, aux;
										$scope.submitted = true;
										if (form && form.$valid) {

											if (data.email && data.email !== user.email && $scope.getEmail)
												newdata.email = data.email;

											if ((!user.numero && data.cpfcnpj) || (data.cpfcnpj && user.numero && data.cpfcnpj !== user.numero.replace(/\D/g, "")) && $scope.getCpf) {
												aux = data.cpfcnpj;
												if (aux.length == 11) {
													if (!user.tipousuario || (user.tipousuario && user.tipousuario !== 'fisico')) {
														newdata.tipousuario = 'fisico';
													}

													aux = aux.replace(/(\d{3})(\d)/, "$1.$2");
													aux = aux.replace(/(\d{3})(\d)/, "$1.$2");
													aux = aux.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
												} else {
													if (!user.tipousuario || (user.tipousuario && user.tipousuario !== 'juridico')) {
														newdata.tipousuario = 'juridico';
													}

													aux = aux.replace(/^(\d{2})(\d)/, "$1.$2");
													aux = aux.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
													aux = aux.replace(/\.(\d{3})(\d)/, ".$1/$2");
													aux = aux.replace(/(\d{4})(\d)/, "$1-$2");
												}
												newdata.numero = aux;
											}

											authService.update(newdata)
												.then(function (res) {
													$modalInstance.close();
													if (res && res.data && res.data.retorno && res.data.retorno.sucesso)
														authService.verifyAuth();

													if (!res || !res.data || !res.data.retorno || !res.data.retorno.sucesso)
														vm.alert({ main: { title: "Falha ao atualizar dados!" } });
													else if (urlNext)
														$location.path(urlNext);
													else if (typeof callback === "function")
														callback();

												}, function (res) { vm.alert({ main: { title: "Falha ao atualizar os dados!" } }) });


										}
									};

									$scope.logout = function () {
										$modalInstance.close();
										authService.logout()
											.then(function (res) {
												vm.login('/carrinho/', '/carrinho/');
											});
									};
								}]
						});
					}
				}

				vm.trailer = function (url, classModel) {
					var windowClass = classModel ? classModel : 'trailer';
					var modalInstance = $modal.open({
						windowClass: windowClass,
						templateUrl: '/views/modal-trailer.html',
						controller: ['$scope', '$modalInstance', '$sce',
							function ($scope, $modalInstance, $sce) {
								$scope.cancel = function () {
									$modalInstance.close();
								};
								$scope.video = $sce.trustAsResourceUrl(url);
							}]
					});
				}

				/*
			
				urlBack = retornar a página especifica após se cadastrar ou login OK
							String or Object

				urlNext = proxima página apos realizar login OK
				callback = chamar function após login OK	

				inscricao = layout espeficico do modal inscricao	  

				*/				

				vm.pagarme = function () {
					// Obs.: é necessário passar os valores boolean como string
					var installments = document.getElementById("installments");
					if(installments != null){
						installments = installments.textContent;
					}else{
						installments = vm.maxInstallments;
					}
					var dados = {
						amount: carrinhoServive.getValorTotal() * 100,
						paymentMethods: 'credit_card',
						customerData: 'true',
						maxInstallments: installments ? installments : 1, 
						items: [],
					};

					var items = carrinhoServive.getItens();
					items.forEach(function(item){
						dados.items.push({
							id: item.id,
							title: item.nome,
							unit_price: item.total * 100,
							quantity: item.quantidade,
							tangible: false
						});
					});

					var user = authService.getUser();
					if(user){
						var phone_numbers = [];
						if(user.phone1)
							phone_numbers.push("+" + user.phone1.replace(/[^0-9]/g,''));
						if(user.phone2)
							phone_numbers.push("+" + user.phone2.replace(/[^0-9]/g,''));
						
						dados.reviewInformations = 'true';
						dados.customer = {
							external_id: user.id,
							name: user.firstname+" "+user.lastname,
							type: user.tipousuario == "fisico" ? 'individual': 'corporation',
							country: user.country ? user.country.toLowerCase() : 'br',
							email: user.email,
							documents: [
								{
									type: 'cpf',
									number: user.numero.replace(/[^0-9]/g,'')
								},
							],
							phone_numbers: phone_numbers
						};
						dados.billing = {
							name: dados.customer.name,
							address: {
								country: dados.customer.country,
								state: user.endereco.state,
								city: user.city,
								neighborhood: user.endereco.district,
								street: user.endereco.logradouro,
								street_number: user.endereco.number ? user.endereco.number.toString() : null,
								zipcode: user.endereco.cep ? user.endereco.cep.replace(/[^0-9]/g,'') : null
							}
						};
					}

					var checkout = new PagarMeCheckout.Checkout({
						encryption_key: Config.pagarme.encryptKey,
						success: function(data) {
							data.amount = carrinhoServive.getValorTotal() * 100;

							var length = 10, charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
							data.password = "";
							for (var i = 0, n = charset.length; i < length; ++i) {
								data.password += charset.charAt(Math.floor(Math.random() * n));
							}

							var promise = {
								method: 'POST',
								loading: true,
								url: Config.url.base + '/forma-pagamento-pagar-me/wsc-forma-pagamento-pagar-me/consulta',
								data: data,
								headers: {
									'Content-Type': 'application/json'
								},
								withCredentials: true
							};
							if(user){ // IF logado 
								promise.headers.Authorization = Config.Authorization + " " + authService.getToken();
							}
							promise = $http(promise);
							promise.then(function success(res) {
								if (res && res.data && res.data.retorno && res.data.retorno.sucesso) {
									if(!authService.isLogged()){
										var credentials = {
											username: res.data.retorno.usuario.username,
											password: data.password
										};
										authService.login(credentials);
									}
								} else {
									vm.alert({ error: true, main: { title: "Falha no processamento do Pagamento! Favor, entrar em contato com nossa central de inscrições", subtitle: res.mensagem } });
								}

								$location.path('/carrinho/confirmacao/' + res.data.retorno.venda);
							});
						},
						error: function(err) {
							console.log(err);
						},
						close: function() {
							console.log('The modal has been closed.');
						}
					});

					checkout.open(dados);
				}

				vm.login = function (urlBack, urlNext, callback, inscricao) {
					var templateUrl = '/views/modal-login.html';
					if(vm.isPagarme)
						templateUrl = '/views/modal-login-pagarme.html';

					return $modal.open({
						templateUrl: templateUrl,
						controller: ['$scope', '$modalInstance', 'QiSatAPI', 'authService', '$location', 'vcRecaptchaService',
							function ($scope, $modalInstance, QiSatAPI, authService, $location, vcRecaptchaService) {

								$scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,6}$/;

								$scope.cancel = function () {
									$modalInstance.close();
								};

								$scope.fnAltoQi = function () {
									$scope.altoqi = !$scope.altoqi;
								};

								$scope.checkIfEnterKeyWasPressed = function ($event, user) {
									var keyCode = $event.which || $event.keyCode;
									if (keyCode === 13) {
										$scope.login(user);
									}
								};


								var items = carrinhoServive.getItens();
								$scope.trilhas = [];
								if (items && items.length) {
									items = items.map(function (item) {
										if (item.isSetup)
											$scope.trilhas.push(item);
										else
											return item;
									});
								}
								$scope.maxInstallments = vm.maxInstallments;
								
								
								$scope.redirectSignup = function () {
									authService.setRedirect(urlBack);
									$modalInstance.close();

									if(items.length && vm.isPagarme){
										vm.pagarme();
									}else{
										$location.path('/cadastro');
									}
								};

								$scope.signin = function () {
									$scope.inscricao = false;
								};

								$scope.clickremember = function () {
									$scope.remember = !$scope.remember;
								};


								$scope.clickvoltar = function () {
									$scope.alert = false;
									$scope.loading = false;
									$scope.remember = false;
									$scope.user = {};
								};

								if (inscricao)
									$scope.inscricao = inscricao;


								// Codigo Recaptcha
								$scope.responseRecaptcha = null;
								$scope.widgetId = null;
								$scope.setResponse = function (responseRecaptcha) {
									$scope.responseRecaptcha = responseRecaptcha;
								};
								$scope.setWidgetId = function (widgetId) {
									$scope.widgetId = widgetId;
								};
								$scope.reloadRecaptcha = function () {
									vcRecaptchaService.reload($scope.widgetId);
									$scope.responseRecaptcha = null;
								};

								$scope.login = function (credentials) {
									credentials.remember = true;
									credentials.altoqi = ($scope.altoqi) ? true : false;
									$scope.alert = false;

									authService.login(credentials).then(function (res) {
										var url;
										if ((res.status == 200) && (res && res.data && res.data.retorno && res.data.retorno.sucesso)) {
											$modalInstance.close();

											if(items.length && vm.isPagarme){
												vm.pagarme();
											}else{
												url = authService.getRedirect();
												if (url) {
													authService.setRedirect();

													if (typeof url == "object") {
														if ("path" in url)
															$location.path(url.path);
														if ("search" in url)
															$location.search(url.search);
													} else
														$location.path(url);

												} else if (urlNext)
													$location.path(urlNext);
												else if (typeof callback === "function")
													callback();

												return res.data.retorno.sucesso;
											}
											
										} else if ((res.status == 200) && (res && res.data && res.data.retorno && res.data.retorno.mensagem))
											$scope.alert = { main: { title: "Falha na Autenticação!", subtitle: res.data.retorno.mensagem } };
										else {
											$scope.alert = { main: { title: "Falha na Autenticação!" } };
											$scope.loading = false;
										}
										return false;
									}, function (res) {
										$scope.alert = { main: { title: "Falha na Autenticação!" } };
										$scope.loading = false;
										return false;
									});
								};

								$scope.sendMail = function (email, recaptcha) {
									var data = { email: email, recaptcha: recaptcha };
									$scope.alert = false;

									QiSatAPI.remember(data)
										.then(function (response) {
											if (response && response.data && response.data.retorno && response.data.retorno.sucesso) {
												$scope.alert = { success: true, main: { title: "Lembrete de senha enviado com Sucesso!" } };
												delete ($scope.email);
												$scope.remember = false;
											} else {
												if (response && response.data && response.data.retorno && response && response.data && response.data.retorno.mensagem && response.data.retorno.mensagem == 'Usuário não encontrado') {
													$scope.alert = { main: { title: "Email não cadastrado!" } };
												} else
													$scope.alert = { main: { title: "Falha no Envio da Mensagem." } };
											}
										}, function (response) {
											$scope.alert = { main: { title: "Falha no Envio da Mensagem." } };
										});
								};

							}],
						windowClass: 'loginModal'
					});
				}
			}]);
})();