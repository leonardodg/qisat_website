(function() {
    'use strict';

	 angular
	 	.module('QiSatApp')
	 	.factory("QiSatAPI", function($http, $filter, Config){

				var _getInstructorsTop = function () {
					return $http({ cache: true, method: 'GET', url: Config.baseUrl+'/instrutores/top'});
				};

				var _getCoursesTop = function () {
					return $http({ cache: true, method: 'GET', url: Config.baseUrl+'/moodle/produtos/top'});
				};

				var _getCourses = function (callback) {
					 $http({ cache: true, method: 'GET', url: Config.baseUrl+'/moodle/produtos'})
								.then( function ( response ){
										var courses = [];
										var filterTypes = $filter('byTypes'),
											filterZpad = $filter('zpad'),
											filterLimitName = $filter('limitName');

										if(response.status == 200) courses = response.data;
										courses.map( function (course, i) {
											var imagemFile;
											if(course){

												course.valorTotal = course.preco;
												course.preco = $filter('currency')(course.preco, 'R$');
												course.imgSrc = Config.imgCursoUrlDefault;
												
												if(course.info){
													if(course.info.files){
														imagemFile = course.info.files.find(function(img) { return img.tipo == '5' });
														if(imagemFile) course.imgSrc =  Config.baseUrl+imagemFile.path.replace(/["\\"]/g,'/').replace( "public" ,'');
													}

													course.nome = filterLimitName(course.info.titulo);

													if( course.categorias.find(function(tipo){ return tipo.id == 32 })) { // Séries
														course.modalidade = "Série Online";
														course.link =  "/curso/online/"+course.info.seo.url ;
														course.info.conteudos.map( function (conteudo){
																	 var aux =  conteudo.titulo.split('-');
																	 conteudo.capitulo = aux[0];
																	 conteudo.nome = aux[1];
																	});
													}else if( course.categorias.find(function(tipo){ return tipo.id == 17 })){ // Pacotes
														course.modalidade = "Pacote de Cursos Online";
														course.link =  "/curso/online/"+course.info.seo.url ;
													}else if( course.categorias.find(function(tipo){ return tipo.id == 40 })){ // PALESTRAS
														course.modalidade = "Palestra Online";
														course.link =  "/curso/online/"+course.info.seo.url ;
													}else if( course.categorias.find(function(tipo){ return tipo.id == 12 })){ // Presenciais Individuais
														course.modalidade = "Curso Presencial - individual";
														course.link =  "/curso/presencial/"+course.info.seo.url ;
													}else if( course.categorias.find(function(tipo){ return tipo.id == 10 })){ // Presencial
														course.modalidade = "Curso Presencial";
														course.link = "/curso/presencial/"+course.info.seo.url;
													}else if( course.categorias.find(function(tipo){ return tipo.id == 2 })){ // A Dinstancia
														course.modalidade = "Curso Online";
														course.link = "/curso/online/"+course.info.seo.url ;
													}
												}

												// PARA PACOTES
												// if(course.produtos){
												// 	course.produtos.map(function(produto){
												// 		if(produto.info && produto.info.seo && produto.info.seo.url){
												// 			produto.url = Config.cursoOnlineUrl+produto.info.seo.url;
												// 		}
												// 	});
												// }
											}
										});
										callback(courses);
									});
				};

				var _getStates = function () {
					return $http({ cache: true, method: 'GET', url: Config.baseUrl+'/moodle/eventos/estados'});
				};

				var _getFilterData = function () {
					return $http({ cache: true, method: 'GET', url: Config.baseUrl+'/moodle/tipo/dados'});
				};

				var _postSendMail = function (data) {
					return $http({ method: 'POST', url: Config.baseUrl+'/sendmail', data: data });
				};

				var _getConvenios = function (data) {
					return $http({ cache: true, method: 'GET', url: Config.baseUrl+'/moodle/convenios' });
				};

				return {
					getConvenios : _getConvenios,
					getCourses : _getCourses,
					getCoursesTop : _getCoursesTop,
					getFilterData : _getFilterData, 
					getInstructorsTop : _getInstructorsTop,
					getStates : _getStates,
					sendMail: _postSendMail
				};
			});
}());