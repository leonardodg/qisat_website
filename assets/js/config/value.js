var QiSatApp = angular.module('QiSatApp');

QiSatApp.value("Config", {
	baseUrl : "http://webservice.qisat.com:3000",
	imagensUrl : "http://webservice.qisat.com:3000/imagens/instrutores/",
	imagensUrlDefault : "http://webservice.qisat.com:3000/imagens/instrutores/instrutor.png",
	imgCursoUrlDefault : "http://webservice.qisat.com:3000/imagens/produtos/default.png",
	cursoOnlineUrl : "/curso/online/",

	filter : { 
			online : [
							 { type : 'links',
							   name : 'links-top', 
							   title : '', // LINKS TOP
									inputs : [
												{ title: 'Todos os Cursos', link : '/cursos', categorias : '' },
												{ title: 'Laçamentos', link : '/cursos/lancamentos', categorias : '' },
												{ title: 'Cursos Gratuitos', link : '/cursos/gratuitos', categorias : ''  }
											]},

							  { type : 'links',
							  	name : 'modalidade',
							  	title : 'Modalidades', 
									inputs : [
												{ title: 'Cursos Online', link : '/cursos/online', categorias : '' },
												{ title: 'Cursos Presenciais', link : '/cursos/presenciais', categorias : ''  }
											]},

							 { type : 'checkbox',
							   name : 'area', 
							   title : 'Área de Atuação', 
									inputs : [
												{ title: 'Estrutural', categorias : '' },
												{ title: 'Elétrica', categorias : '' },
												{ title: 'Hidráulica', categorias : '' },
												{ title: 'Agronômica', categorias : '' },
												{ title: 'Arquitetônica', categorias : '' },
												{ title: 'CAD', categorias : ''  }
											]},


							 { type : 'checkbox', 
							   name : 'area-complementar',
							   title : 'Área Complementar', 
									inputs : [
												{ title: 'Administração', categorias : '' },
												{ title: 'Qualidade e Desempenho', categorias : '' },
												{ title: 'Gestão de Projetos', categorias : '' }
											]},	

							 { type : 'checkbox',
							   name : 'tipo',
							   title : 'Tipo', 
									inputs : [
												{ title: 'Cursos Teóricos', categorias : '' },
												{ title: 'Cursos Software AltoQi', categorias : '' }
											]},

							 { type : 'radio', 
							   name : 'tipo-produto',
							   title : 'Sugestão de Compra', 
									inputs : [
												{ title: 'Cursos Teóricos', categorias : '' },
												{ title: 'Cursos Software AltoQi', categorias : '' }
											]}
					 ],
			presencial : [
							 { type : 'links', 
							   name : 'links-top', 
							   title : '', // LINKS TOP
									inputs : [
												{ title: 'Todos os Cursos', link : '/cursos', categorias : '' },
												{ title: 'Laçamentos', link : '/cursos/lacamentos', categorias : '' },
												{ title: 'Cursos Gratuitos', link : '/cursos/gratuitos', categorias : ''  }
											]},

							  { type : 'links',
							    name : 'modalidade',
							  	title : 'Modalidades', 
									inputs : [
												{ title: 'Cursos Online', link : '/cursos/online', categorias : '' },
												{ title: 'Cursos Presenciais', link : '/cursos/presenciais', categorias : ''  }
											]},

							  { type : 'dropdown', name: 'estado', title: 'Estado', inputs : [] },	


							  { type : 'checkbox',
							  	name : 'edicao', 
												inputs : [
															{ title: 'Vagas Abertas', categorias : '' },
															{ title: 'Próximos Cursos', categorias : '' }
														]},										

							  { type : 'checkbox', 
							    name : 'area',
							    title : 'Área de Atuação', 
									inputs : [
												{ title: 'Estrutural', categorias : '' },
												{ title: 'Elétrica', categorias : '' },
												{ title: 'Hidráulica', categorias : '' }
											]},

							   { type : 'radio', 
							     name : 'tipo',
							     title : 'Tipo', 
									inputs : [
												{ title: 'Cursos Teóricos', categorias : '' },
												{ title: 'Cursos Software AltoQi', categorias : '' },
												{ title: 'Cursos Individuais', categorias : '' }
											]}
			]
	}
});