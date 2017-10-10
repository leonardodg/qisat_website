(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('infoController', ['$scope', '$controller', '$sce', '$location','$filter', '$timeout','QiSatAPI', 'authService', 'Config', 'Info',
					 function(scope, $controller, $sce, $location, $filter, $timeout, QiSatAPI, authService, Config, info) {
						 	var vm = this, filterLimitName = $filter('limitName'),
						 		absUrl = $location.absUrl(),
						 		path, search = absUrl.indexOf('?'), params, turma,
						 		modalController = $controller('modalController'),
	                			tipo, produto, itens, valorItens = 0, videoDemo, aux;

					 		
					 		moment.locale('pt-BR');
					 		modalController.showZopim(true, false);

							var parseQueryString = function() {

							    var str = window.location.search;
							    var objURL = {};

							    str.replace(
							        new RegExp( "([^?=&]+)(=([^&]*))?", "g" ),
							        function( $0, $1, $2, $3 ){
							            objURL[ $1 ] = $3;
							        }
							    );
							    return objURL;
							};

					 		if(search > 0){
					 			path = absUrl.substring(absUrl.indexOf('curso/'), search);
					 			params = parseQueryString();
								turma = params["turma"]; 
					 		}else
					 			path = absUrl.substr(absUrl.indexOf('curso/'));	

							vm.openPopupWindow = function(link){
									$window.open(link, "popup", "width=1014,height=667");
							};

							vm.inscricao = function(produto){
								var auth = authService.Authenticated();

								function enrol(){
									authService.inscricao(produto)
					 					   .then(function (res) {
					 							if(res.status == 200 && res.data && res.data.retorno && res.data.retorno.sucesso && res.data.retorno.link){
					 								modalController.alert({ success : true, main : { title : "Matricula no curso realizada!", subtitle : " Você será redirecionado para página do curso." } });
					 								$timeout(function() {
												      	window.location = res.data.retorno.link;
												      }, 10000);
					 							}else
					 								modalController.alert({ error : true, main : { title : "Falha para realizar Matricula!", subtitle : " Entre em contato com a central de Inscrições." } });

					 						}, function(){
					 							modalController.alert({ error : true, main : { title : "Falha para realizar Matricula!", subtitle : " Entre em contato com a central de Inscrições." } });
					 						});
								};

						 		if(auth === true){
					 				enrol();
						 		}else if (auth === false){
						 			modalController.login('/', false, enrol);
						 		}else{
						 			auth.then(function(res){
					 					if(auth === true){
							 				enrol();
								 		}else{
								 			modalController.login('/', false, enrol);
								 		}
						 			});
						 		}
						 	};

					 	vm.viewTurma = function(turmaid){
					 		if(vm.info && vm.info.produto && vm.info.produto.eventos && vm.info.produto.eventos.length){
								var edicao, id = vm.turma.id;

								edicao = vm.info.produto.eventos.find( function (evento){
									return evento.id == turmaid;
								});
								if(edicao){
									edicao.hide = true;
									vm.turma = edicao;
									// $location.search('turma', turmaid);

									if(edicao.instrutor)
										vm.info.produto.instrutor = edicao.instrutor;

									edicao = vm.info.produto.eventos.find( function (evento){
										return evento.id == id;
									});
									edicao.hide = false;
								}
							}
					 	};

	               		if(info){
	                    	info.descricao = $sce.trustAsHtml(info.descricao);
	                    	info.persona = $sce.trustAsHtml(info.persona);

	                    	if(info.faqs && info.faqs.length){
	                    		info.faqs.map(function(faq){
					 				return faq.descricao = $sce.trustAsHtml(faq.descricao);
					 			});
	                    	}

							if(info.files && info.files.length){
					 			info.imgtop = info.files.find(function(img){
					 				return img.tipo == "3";
					 			});

					 			info.imgdemo = info.files.filter(function(img){
					 				return img.tipo == "6";
					 			});

					 			info.videodemo = info.files.find(function(video){
					 				return video.tipo == "2";
					 			});

					 			if(info.videodemo && info.videodemo.link && info.videodemo.link.indexOf('qisat.com')>=0)
					 				info.videodemo.class = 'videoDemo';
					 			
					 		}

							if(info.produto && info.produto.categorias){
								

								if(tipo = info.produto.categorias.find(function(tipo){ return tipo.id == 8 })){ // Gratuito
									info.modalidade = tipo.nome;
									info.isFree = true;
								}else if(tipo = info.produto.categorias.find(function(tipo){ return tipo.id == 47 })) { // Fase Trilha
									info.modalidade = tipo.nome;
									info.isSetup = true;
								}else if(tipo = info.produto.categorias.find(function(tipo){ return tipo.id == 32 })) { // Séries
									info.modalidade = tipo.nome;
									info.isSerie = true;
								}else if(tipo = info.produto.categorias.find(function(tipo){ return tipo.id == 42 })){ // Certificacao
									info.modalidade = tipo.nome;
									
									if(tipo = info.produto.categorias.find(function(tipo){ return tipo.id == 44 }))
										info.packCert = true;
									else
										info.testCert = true;

								}else if(tipo = info.produto.categorias.find(function(tipo){ return tipo.id == 17 })){ // Pacotes
									info.modalidade = tipo.nome;
									info.isPack = true;
								}else if(tipo = info.produto.categorias.find(function(tipo){ return tipo.id == 40 })){ // PALESTRAS
									info.modalidade = tipo.nome;
									info.isLecture = true;
								}else if(tipo = info.produto.categorias.find(function(tipo){ return tipo.id == 12 })){ // Presenciais Individuais
									info.modalidade = tipo.nome;
									info.isIndividual = true;
								}else if(tipo = info.produto.categorias.find(function(tipo){ return tipo.id == 10 })){ // Presencial
									info.modalidade = tipo.nome;
									info.isClassroom = true;
								}else if(tipo = info.produto.categorias.find(function(tipo){ return tipo.id == 2 })){ // A Dinstancia
									info.modalidade = tipo.nome;
									info.isOnline = true;
								}
							}

							if(info.isSerie && info.produto && info.produto.produtos && info.produto.produtos.length){
								
								info.conteudos = [];
								info.produto.id = [];
								produto = info.produto.produtos.find(function (prod){
									if(prod && prod.categorias)
										return prod.categorias.find(function(tipo){ return tipo.id == 41 });
								});

								itens = info.produto
											.produtos.filter(function (prod){
																if(prod && prod.categorias)
																	return prod.categorias
																				.find(function(tipo){ return tipo.id == 33 });
															});
								if(itens && itens.length){
									itens.map( function (prod){ 
													valorItens += prod.preco; 
													info.produto.id.push(prod.id); 
													if(prod && prod.info){
														aux = {
																preco : prod.preco,
																titulo : prod.info.titulo,
																descricao : prod.info.descricao,
																dataValor : {
																	produto : prod.id,
																	valor : $filter('currency')(prod.preco, 'R$')
																},
																info : prod.info
														};

														if(prod.info.files && prod.info.files.length){
															videoDemo = prod.info.files.find(function(file){ return file.id_tipo == "2" });
															if(videoDemo) aux.demoplay = videoDemo.link;
														}
														info.conteudos.push(aux);
													}
											 	});
								}

								if(produto){
									info.produto.id = produto.id;
									info.precoTotal =  $filter('currency')(produto.preco, 'R$');
									if(produto.promocao){
										info.preco = $filter('currency')(produto.valorTotal, 'R$');
										info.promocaoDateend = $filter('date')( produto.promocao.datafim*1000, 'dd/MM/yyyy' );
									}else
										info.preco = $filter('currency')(produto.preco, 'R$');
								}else{
									info.precoTotal =  $filter('currency')(valorItens, 'R$');
									info.preco =  $filter('currency')(valorItens, 'R$');
								}
							}else if(info.produto){
								info.precoTotal =  $filter('currency')(info.produto.preco, 'R$');
								if(info.promocao){
									info.preco = $filter('currency')(info.valorTotal, 'R$');
									info.promocaoDateend = $filter('date')( info.promocao.datafim*1000, 'dd/MM/yyyy' );
								}else
									info.preco = $filter('currency')(info.produto.preco, 'R$');


								if(info.isSetup){
									info.precoParcelado = $filter('currency')(info.valorParcelado, 'R$');
									if(info.promocao)
										info.precoTotal = $filter('currency')( (info.valorTotal / info.parcelas), 'R$');
								}
								

								if( (info.isPack || info.packCert) && info.produto.produtos && info.produto.produtos.length){
									info.conteudos = [];

									info.produto.produtos.map( function (prod){ 
													if(prod && prod.info){
														var aux = {}, aulas, tempo, horas;
															
														aux.preco = prod.preco;
														aux.id = prod.info.id;
														aux.titulo = prod.nome;
														aux.descricao = prod.info.descricao;

														if(prod.info.files && prod.info.files.length){
															videoDemo = prod.info.files.find(function(file){ return file.id_tipo == "2" });
															if(videoDemo) aux.demoplay = videoDemo.link;
														}

														if(prod.info.qtd_aulas) { 
															prod.info.qtd_aulas = prod.info.qtd_aulas.toString(); 
															aux.descricao +=  '<br><strong> Quantidade de Aulas:</strong>&nbsp;'+prod.info.qtd_aulas+'('+prod.info.qtd_aulas.extenso()+') aulas';
														}

														if(prod.tempo_aula){
															prod.tempo_aula = prod.tempo_aula.toString();
															aux.descricao += '<br><strong> Tempo de acesso disponível por aula:</strong>&nbsp;'+prod.tempo_aula+' ('+prod.tempo_aula.extenso()+') horas';
														}

														if(prod.info.carga_horaria ) {
															prod.info.carga_horaria = prod.info.carga_horaria.toString();
															aux.descricao += '<br><strong> Carga horária:</strong>&nbsp;'+prod.info.carga_horaria+' ('+prod.info.carga_horaria.extenso()+') horas';
														}
										
														info.conteudos.push(aux);
													}
											 	});
								}
							}

							if(info.produto && info.produto.instrutor){
								info.produto.instrutor.map(function(instrutor){
									instrutor.descricao = $sce.trustAsHtml(filterLimitName(instrutor.descricao,500));
									if(!instrutor.ecm_imagem_id) instrutor.imagem = { src : Config.imagensUrlDefault };
								});
							}

					 		if(info.conteudos && info.conteudos.length){
					 			info.conteudos.map(function (conteudo){
					 				conteudo.descricao = $sce.trustAsHtml(conteudo.descricao);
					 			});
					 		}

							if(info.produto && info.produto.eventos && info.produto.eventos.length){

								info.produto.eventos.map( function (evento){
									evento.qtd = 1;
									evento.isClass = true;
									evento.curso = info.titulo;

									if(turma && turma == evento.id)
										evento.hide = true;
									else
										evento.hide = false;

									if(evento.cidade && evento.cidade.estado) {
										evento.timestart = moment.unix(evento.data_inicio);
										evento.timeend   = moment.unix(evento.data_fim);
										evento.cidadeuf  = evento.cidade.nome + ' - ' +evento.cidade.estado.uf;
										evento.datauf  = evento.cidadeuf+ ' - ' +evento.timestart.tz("America/Sao_Paulo").format('DD/MM/YYYY' );
										evento.uf = evento.cidade.estado.uf;
									}

									if(evento.valor_produto == "true"){
										evento.valor = $filter('currency')(info.produto.preco, '', 2); 
										evento.preco = info.preco;
									}else
										evento.preco = $filter('currency')(evento.valor, 'R$');

									evento.vagas = evento.vagas_total -  evento.vagas_preenchidas;

									if(evento.local && evento.local.length){
										evento.lugar = [];
										evento.datas = [];
										evento.local.map(function (edicao){
											var aux, novo = {};
											edicao.timestart = moment.unix(edicao.data_inicio);
											edicao.timeend = moment.unix(edicao.data_fim);
											edicao.timeexit = moment.unix(edicao.saida_intervalo);
											edicao.timeback = moment.unix(edicao.volta_intervalo);

											aux = edicao.timestart.tz("America/Sao_Paulo").format("dddd, D MMMM YYYY - [das] HH:mm [às] ")+ edicao.timeexit.tz("America/Sao_Paulo").format("HH:mm [e das] ")+edicao.timeback.tz("America/Sao_Paulo").format("HH:mm [às] ")+edicao.timeend.tz("America/Sao_Paulo").format("HH:mm");
											evento.datas.push(aux);

											if(edicao.local){
												aux = evento.lugar.find(function (lugar){ return edicao.local.id == lugar.id });
												if(!aux){
													novo.id = edicao.local.id;
													if(edicao.local.cidade){
														novo.cidade = edicao.local.cidade.nome;
														novo.cidadeuf = edicao.local.cidade.nome+' - '+edicao.local.cidade.estado.uf;
														novo.endereco = $sce.trustAsHtml(edicao.local.endereco); 
													}
													novo.nome = edicao.local.nome;
													evento.lugar.push(novo);
												}
											}
										});
									}

									if(evento.instrutor && evento.instrutor.length){
										evento.instrutor.map(function(instrutor){
											instrutor.descricao = $sce.trustAsHtml(filterLimitName(instrutor.descricao,500));
										});
									}
								});

								if(turma){
									vm.turma = info.produto.eventos.find(function(evento){ return evento.id == turma });
									if(!vm.turma){
										vm.turma = info.produto.eventos[0];
										vm.turma.hide = true;
										info.produto.instrutor = info.produto.eventos[0].instrutor;
									}else
										info.produto.instrutor = vm.turma.instrutor;
								}else{
									vm.turma = info.produto.eventos[0];
									vm.turma.hide = true;
									info.produto.instrutor = info.produto.eventos[0].instrutor;
								}
							}
	                   		vm.info = info;
	                   	}
		 }]);
})();