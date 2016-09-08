var QiSatApp = angular.module('QiSatApp');

QiSatApp.value("Config", {
	baseUrl : "http://webservice.qisat.com:3000",
	imagensUrl : "http://webservice.qisat.com:3000/imagens/instrutores/",
	imagensUrlDefault : "http://webservice.qisat.com:3000/imagens/instrutores/instrutor.png",
	imgCursoUrlDefault : "http://webservice.qisat.com:3000/imagens/produtos/default.png",
	cursoOnlineUrl : "/curso/online/",

	filters : { 

			online : [


							 { 
							   id : 4,
							   type : 'checkbox', 
							   name : 'Combinacoes',
							   title : 'Combinações', 
									inputs : [
												{ title: 'Séries de Capítulos', type : 32, name : 'series' },
												{ title: 'Pacotes de Cursos', type : 17, name : 'pacotes' }
											]},

							 { 
							   id : 5,
							   type : 'checkbox',
							   name : 'Area', 
							   title : 'Área de Atuação', 
									inputs : [
												{ title: 'Estrutural', type : 3, name : 'estrutural' },
												{ title: 'Elétrica', type : 4, name : 'eletrica' },
												{ title: 'Hidráulica', type : 6, name : 'hidraulica' },
												{ title: 'Agronômica', type : 34, name : 'agronomica' },
												{ title: 'Arquitetônica', type : 35, name : 'arquitetonica' },
												{ title: 'CAD', type : 5, name : 'cad' }
											]},


							 { 
							   id : 6,
							   type : 'checkbox', 
							   name : 'Area-Complementar',
							   title : 'Área Complementar', 
									inputs : [
												{ title: 'Administração', type : 36, name : 'adm' },
												{ title: 'Qualidade e Desempenho', type : 37, name : 'desempenho' },
												{ title: 'Gestão de Projetos', type : 38, name : 'gestao' }
											]},	

							 { 
							   id : 7,
							   type : 'checkbox',
							   name : 'Tipo',
							   title : 'Tipo', 
									inputs : [
												{ title: 'Cursos Teóricos', type : 24, },
												{ title: 'Cursos Software AltoQi', type : 23 }
											]}

					 ],
			presencial : [

							  { id : 3, type : 'dropdown', name: 'estado', title: 'Estado', inputs : [] },	

							  {
							  	id : 5,
							    type : 'checkbox', 
							    name : 'Area',
							    title : 'Área de Atuação', 
									inputs : [
												{ title: 'Estrutural', type : 25, name : 'estrutural' },
												{ title: 'Elétrica', type : 26, name : 'eletrica' },
												{ title: 'Hidráulica', type : 27, name : 'hidraulica' }
											]},

							   { 
							   	 id : 7,
							   	 type : 'checkbox', 
							     name : 'Tipo',
							     title : 'Tipo', 
									inputs : [
												{ title: 'Cursos Teóricos', type : 24, presencial : 13 },
												{ title: 'Cursos Software AltoQi', type : 23, presencial : 11 },
											]},

								{ 
							   	 id : 10,
							   	 type : 'checkbox', 
							     name : 'Tipo',
									inputs : [
												{ title: 'Cursos Individuais', type : 12, name : '#Tipo2' }
											]}
			]
	}
});