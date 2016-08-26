var QiSatApp = angular.module('QiSatApp');

QiSatApp.value("Config", {
	baseUrl : "http://webservice.qisat.com:3000",
	imagensUrl : "http://webservice.qisat.com:3000/imagens/instrutores/",
	imagensUrlDefault : "http://webservice.qisat.com:3000/imagens/instrutores/instrutor.png",
	imgCursoUrlDefault : "http://webservice.qisat.com:3000/imagens/produtos/default.png",
	cursoOnlineUrl : "/curso/online/",

	filters : { 

			all : [
							 { id : 1,
							   type : 'links',
							   name : 'links-top', 
							   title : '', // LINKS TOP
									inputs : [
												{ title: 'Todos os Cursos', link : '/cursos', type : 1 },
												{ title: 'Laçamentos', link : '/cursos/lancamentos', type : 39  },
												{ title: 'Cursos Gratuitos', link : '/cursos/gratuitos', type : 8  }
											]},

							  { 
							  	id : 2,
							  	type : 'links',
							  	name : 'modalidade',
							  	title : 'Modalidades', 
									inputs : [
												{ title: 'Cursos Online', link : '/cursos/online', type : 2 },
												{ title: 'Cursos Presenciais', link : '/cursos/presenciais', type : 10 }
											]},

  							 { id : 3, type : 'dropdown', name: 'estado', title: 'Presencial Por Estado', inputs : [] },	

							 { 
							   id : 4,
							   type : 'checkbox', 
							   name : 'tipo-produto',
							   title : 'Combinação Cursos Online', 
									inputs : [
												{ title: 'Séries de Capítulos', type : 32 },
												{ title: 'Pacotes de Cursos', type : 17 }
											]},

							 { 
							   id : 5,
							   type : 'checkbox',
							   name : 'area', 
							   title : 'Área de Atuação', 
									inputs : [
												{ title: 'Estrutural', type : 3, presencial : 25, pacote : 18 },
												{ title: 'Elétrica', type : 4, presencial : 26, pacote : 19 },
												{ title: 'Hidráulica', type : 6, presencial : 27, pacote : 20},
												{ title: 'Agronômica', type : 34 },
												{ title: 'Arquitetônica', type : 35 },
												{ title: 'CAD', type : 5,  presencial : 28 }
											]},


							 { 
							   id : 6,
							   type : 'checkbox', 
							   name : 'area-complementar',
							   title : 'Área Complementar', 
									inputs : [
												{ title: 'Administração', type : 36 },
												{ title: 'Qualidade e Desempenho', type : 37 },
												{ title: 'Gestão de Projetos', type : 38 }
											]},	

							 { 
							   id : 7,
							   type : 'checkbox',
							   name : 'tipo',
							   title : 'Tipo', 
									inputs : [
												{ title: 'Cursos Teóricos', type : 24, presencial : 13 },
												{ title: 'Cursos Software AltoQi', type : 23, presencial : 11 },
												{ title: 'Cursos Individuais', type : 12 }
											]}

					 ],


			online : [
							 { 
							   id : 1,
							   type : 'links',
							   name : 'links-top', 
							   title : '', // LINKS TOP
									inputs : [
												{ title: 'Todos os Cursos', link : '/cursos', type : 1 },
												{ title: 'Laçamentos', link : '/cursos/lancamentos', type : 39  },
												{ title: 'Cursos Gratuitos', link : '/cursos/gratuitos', type : 8  }
											]},

							  { 
							  	id : 2,
							  	type : 'links',
							  	name : 'modalidade',
							  	title : 'Modalidades', 
									inputs : [
												{ title: 'Cursos Online', link : '/cursos/online', type : 2 },
												{ title: 'Cursos Presenciais', link : '/cursos/presenciais', type : 10 }
											]},

							 { 
							   id : 4,
							   type : 'checkbox', 
							   name : 'tipo-produto',
							   title : 'Sugestão de Compra', 
									inputs : [
												{ title: 'Séries de Capítulos', type : 32 },
												{ title: 'Pacotes de Cursos', type : 17 }
											]},

							 { 
							   id : 5,
							   type : 'checkbox',
							   name : 'area', 
							   title : 'Área de Atuação', 
									inputs : [
												{ title: 'Estrutural', type : 3 },
												{ title: 'Elétrica', type : 4 },
												{ title: 'Hidráulica', type : 6 },
												{ title: 'Agronômica', type : 34 },
												{ title: 'Arquitetônica', type : 35 },
												{ title: 'CAD', type : 5 }
											]},


							 { 
							   id : 6,
							   type : 'checkbox', 
							   name : 'area-complementar',
							   title : 'Área Complementar', 
									inputs : [
												{ title: 'Administração', type : 36 },
												{ title: 'Qualidade e Desempenho', type : 37 },
												{ title: 'Gestão de Projetos', type : 38 }
											]},	

							 { 
							   id : 7,
							   type : 'checkbox',
							   name : 'tipo',
							   title : 'Tipo', 
									inputs : [
												{ title: 'Cursos Teóricos', type : 24 },
												{ title: 'Cursos Software AltoQi', type : 23 }
											]}

					 ],
			presencial : [
							 { 
							   id : 1,
							   type : 'links', 
							   name : 'links-top', 
							   title : '', // LINKS TOP
									inputs : [
												{ title: 'Todos os Cursos', link : '/cursos', type : 1 },
												{ title: 'Laçamentos', link : '/cursos/lacamentos', type : 39 },
												{ title: 'Cursos Gratuitos', link : '/cursos/gratuitos', type : 8  }
											]},

							  { 
							  	id : 2,
							  	type : 'links',
							    name : 'modalidade',
							  	title : 'Modalidades', 
									inputs : [
												{ title: 'Cursos Online', link : '/cursos/online', type : 2 },
												{ title: 'Cursos Presenciais', link : '/cursos/presenciais', type : 10  }
											]},

							  { id : 3, type : 'dropdown', name: 'estado', title: 'Estado', inputs : [] },	


							  // { 
							  // 	id : 8,
							  // 	type : 'checkbox',
							  // 	name : 'edicao', 
									// 			inputs : [
									// 						{ title: 'Vagas Abertas', type : '' },
									// 						{ title: 'Próximos Cursos', type : '' }
									// 					]},										

							  {
							  	id : 5,
							    type : 'checkbox', 
							    name : 'area',
							    title : 'Área de Atuação', 
									inputs : [
												{ title: 'Estrutural', type : 25 },
												{ title: 'Elétrica', type : 26 },
												{ title: 'Hidráulica', type : 27 }
											]},

							   { 
							   	 id : 7,
							   	 type : 'checkbox', 
							     name : 'tipo',
							     title : 'Tipo', 
									inputs : [
												{ title: 'Cursos Teóricos', type : 24, presencial : 13 },
												{ title: 'Cursos Software AltoQi', type : 23, presencial : 11 },
												{ title: 'Cursos Individuais', type : 12 }
											]}
			]
	}
});