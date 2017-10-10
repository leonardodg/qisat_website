(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller("TopCoursesController",
			function($scope, $controller, $filter, $timeout, Config,  QiSatAPI,  authService){

						var modalController = $controller('modalController');

						$scope.inscricao = function(produto){
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

						QiSatAPI.getCoursesTop()
								.then( function ( response ){
									var courses = [], filterLimitName = $filter('limitName');
									if(response.status == 200) courses = response.data.retorno;
									
									courses.map( function (course) {
										var imagemFile, tipo, produto, itens, valorItens = 0;
										if(course){

											course.nomeLimit = filterLimitName(course.nome, 48);

											if(course.imagens && course.imagens.length){
												imagemFile = course.imagens.find( function(img) { 
													return img && img.type == 'Imagens - Capa'; 
												});
												if(imagemFile) course.imgSrc = imagemFile.src;
											}

											if(course.categorias && course.categorias.length){
												//serie, pack, classroom, events, single, releases, free, online
												if(tipo = course.categorias.find(function(tipo){ return tipo.id == 8 })){ // Gratuito
													course.modalidade = tipo.nome;
													course.isFree = true;
												}else if(tipo = course.categorias.find(function(tipo){ return tipo.id == 47 })) { // Fase Trilha
													course.modalidade = tipo.nome;
													course.isSetup = true;
												}else if(tipo = course.categorias.find(function(tipo){ return tipo.id == 32 })) { // Séries
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
											}

											if(course.isSerie && course.produtos && course.produtos.length){
																		
												course.id = [];
												produto = course.produtos.find(function (prod){
													if(prod && prod.categorias)
														return prod.categorias.find(function(tipo){ return tipo.id == 41 });
												});

												itens = course.produtos.filter(function (prod){
																			if(prod && prod.categorias)
																				return prod.categorias.find(function(tipo){ return tipo.id == 33 });
																		});

												if(itens && itens.length){
													itens.map( function (prod){ 
																	valorItens += prod.preco; 
																	course.id.push(prod.id);
															 	});
												}

												if(produto){
													course.id = produto.id;
													course.precoTotal =  $filter('currency')(produto.preco, 'R$');
													if(produto.promocao){
														course.preco = $filter('currency')(produto.valorTotal, 'R$');
														course.promocaoDateend = $filter('date')( produto.promocao.datafim*1000, 'dd/MM/yyyy' );
													}else
														course.preco = $filter('currency')(produto.preco, 'R$');
												}else{
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
										}
									});
									$scope.topCourses = courses;
								 });
			});
})();
