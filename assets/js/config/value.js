var QiSatApp = angular.module('QiSatApp');

QiSatApp.value("Config", {
	baseUrl : "http://webservice.qisat.com:3000",
	imagensUrl : "http://webservice.qisat.com:3000/imagens/instrutores/",
	imagensUrlDefault : "http://webservice.qisat.com:3000/imagens/instrutores/instrutor.png",
	imgCursoUrlDefault : "http://webservice.qisat.com:3000/imagens/produtos/default.png",
	cursoOnlineUrl : "/curso/online/"
});