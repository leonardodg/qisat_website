(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller('infoController', ['$scope','$sce', '$location', '$filter', 'QiSatAPI', '$modal',
					 function(scope, $sce, $location, $filter, QiSatAPI, $modal) {
						 	var vm = this, filterLimitName = $filter('limitName'),
						 		absUrl = $location.absUrl(),
						 		path, search = absUrl.indexOf('?'), params, turma;
					 		
					 		moment.locale('pt-BR');

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

							var videosDemo = [
									   		"https://www.youtube.com/embed/fOrGTKQJqHU",
									   		"https://www.youtube.com/embed/VBPKeNidHco"
									   		];

					 		if(search > 0){
					 			path = absUrl.substring(absUrl.indexOf('curso/'), search);
					 			params = parseQueryString();
								turma = params["turma"]; 
					 		}else
					 			path = absUrl.substr(absUrl.indexOf('curso/'));					 		

						activate();


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

						function activate() {
					         return QiSatAPI.getInfo(path)
					                        .then(function(info){
					                        	var tipo;
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
											 		}

											 		if(info.conteudos && info.conteudos.length){
											 			// REFAZER
											 			info.conteudos[0].demoplay = videosDemo[0]; // TEMPORARIO
											 			info.conteudos[0].dataValor = { valor : "R$500,00", valorReal : "R$700,00", data : "Até 10/01/2017", produto : 1};

											 			info.conteudos.map(function (conteudo){
											 				conteudo.descricao = $sce.trustAsHtml(conteudo.descricao);
											 			});
											 		}

													info.precoTotal =  $filter('currency')(info.produto.preco, 'R$');
													if(info.promocao){
														info.preco = $filter('currency')(info.valorTotal, 'R$');
														info.promocaoDateend = $filter('date')( info.promocao.datafim*1000, 'dd/MM/yyyy' );
													}else
														info.preco = $filter('currency')(info.produto.preco, 'R$');


													if(info.produto && info.produto.categorias){
														if(tipo = info.produto.categorias.find(function(tipo){ return tipo.id == 32 })) { // Séries
															info.modalidade = tipo.nome;
															info.isSerie = true;
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

													if(info.produto && info.produto.instrutor){
														info.produto.instrutor.map(function(instrutor){
															instrutor.descricao = $sce.trustAsHtml(filterLimitName(instrutor.descricao,500));
														});
													}

													if(info.produto && info.produto.eventos && info.produto.eventos.length){

														info.produto.eventos.map( function (evento){
															evento.qtd = 1;

															if(turma && turma == evento.id)
																evento.hide = true;
															else
																evento.hide = false;

															if(evento.cidade && evento.cidade.estado) {
																evento.timestart = moment.unix(evento.data_inicio);
																evento.timeend   = moment.unix(evento.data_fim);
																evento.cidadeuf  = evento.cidade.nome + ' - ' +evento.cidade.estado.uf;
																evento.datauf  = evento.cidadeuf+ ' - ' +evento.timestart.format('DD/MM/YYYY' );
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

																	aux = edicao.timestart.format("dddd, D MMMM YYYY - [das] HH:mm [às] ")+ edicao.timeexit.format("HH:mm [e das] ")+edicao.timeback.format("HH:mm [às] ")+edicao.timeend.format("HH:mm");
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
					                            return vm.info;
					                        });
				        };
		 }])
		.run(function($rootScope, $location, $anchorScroll) {
			    $rootScope.$on('$locationChangeSuccess', function (event, newUrl, oldUrl) {
			    	if($location.hash()) 
			    		$anchorScroll();
			    });
		});

})();