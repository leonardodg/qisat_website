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
												{ title: 'Todos os Cursos', link : '/cursos' },
												{ title: 'Laçamentos', link : '/cursos/lancamentos' },
												{ title: 'Cursos Gratuitos', link : '/cursos/gratuitos'  } // type : ''
											]},

							  { type : 'links',
							  	name : 'modalidade',
							  	title : 'Modalidades', 
									inputs : [
												{ title: 'Cursos Online', link : '/cursos/online' },
												{ title: 'Cursos Presenciais', link : '/cursos/presenciais' }
											]},

							 { type : 'checkbox',
							   name : 'area', 
							   title : 'Área de Atuação', 
									inputs : [
												{ title: 'Estrutural', type : 3 },
												{ title: 'Elétrica', type : 4 },
												{ title: 'Hidráulica', type : 6 },
												{ title: 'Agronômica', type : 34 },
												{ title: 'Arquitetônica', type : 35 },
												{ title: 'CAD', type : 5  }
											]},


							 { type : 'checkbox', 
							   name : 'area-complementar',
							   title : 'Área Complementar', 
									inputs : [
												{ title: 'Administração', type : 36 },
												{ title: 'Qualidade e Desempenho', type : 37 },
												{ title: 'Gestão de Projetos', type : 38 }
											]},	

							 { type : 'checkbox',
							   name : 'tipo',
							   title : 'Tipo', 
									inputs : [
												{ title: 'Cursos Teóricos', type : 24 },
												{ title: 'Cursos Software AltoQi', type : 23 }
											]},

							 { type : 'radio', 
							   name : 'tipo-produto',
							   title : 'Sugestão de Compra', 
									inputs : [
												{ title: 'Séries de Capítulos', type : 32 },
												{ title: 'Pacotes de Cursos', type : 17 }
											]}
					 ],
			presencial : [
							 { type : 'links', 
							   name : 'links-top', 
							   title : '', // LINKS TOP
									inputs : [
												{ title: 'Todos os Cursos', link : '/cursos', type : '' },
												{ title: 'Laçamentos', link : '/cursos/lacamentos', type : '' },
												{ title: 'Cursos Gratuitos', link : '/cursos/gratuitos', type : ''  }
											]},

							  { type : 'links',
							    name : 'modalidade',
							  	title : 'Modalidades', 
									inputs : [
												{ title: 'Cursos Online', link : '/cursos/online', type : '' },
												{ title: 'Cursos Presenciais', link : '/cursos/presenciais', type : ''  }
											]},

							  { type : 'dropdown', name: 'estado', title: 'Estado', inputs : [] },	


							  { type : 'checkbox',
							  	name : 'edicao', 
												inputs : [
															{ title: 'Vagas Abertas', type : '' },
															{ title: 'Próximos Cursos', type : '' }
														]},										

							  { type : 'checkbox', 
							    name : 'area',
							    title : 'Área de Atuação', 
									inputs : [
												{ title: 'Estrutural', type : '' },
												{ title: 'Elétrica', type : '' },
												{ title: 'Hidráulica', type : '' }
											]},

							   { type : 'radio', 
							     name : 'tipo',
							     title : 'Tipo', 
									inputs : [
												{ title: 'Cursos Teóricos', type : '' },
												{ title: 'Cursos Software AltoQi', type : '' },
												{ title: 'Cursos Individuais', type : '' }
											]}
			]
	}
});