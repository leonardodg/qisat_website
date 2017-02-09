(function() {
    'use strict';

	angular
		.module('QiSatApp')
		.controller("TopCoursesController",
			function($scope, QiSatAPI, Config, $filter){
						QiSatAPI.getCoursesTop()
								.then( function ( response ){
									var courses = [], filterLimitName = $filter('limitName');
									if(response.status == 200) courses = response.data.retorno;
									courses.map( function (course) {
										var imagemFile, tipo;
										if(course){

											course.nomeLimit = filterLimitName(course.nome, 48);
											course.precoTotal =  $filter('currency')(course.preco, 'R$');
											if(course.promocao){
												course.preco = $filter('currency')(course.valorTotal, 'R$');
												course.promocaoDateend = $filter('date')( course.promocao.datafim*1000, 'dd/MM/yyyy' );
											}else
												course.preco = $filter('currency')(course.preco, 'R$');
											

											if(course.imagens && course.imagens.length){
												imagemFile = course.imagens.find(function(img) { return img.type == 'Imagens - Capa' });
												if(imagemFile) course.imgSrc = imagemFile.src;
											}

											if(course.categorias && course.categorias.length){
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
											}	
											
										}
									});
									$scope.topCourses = courses;
								 });
			});
})();
