var appQiSat = angular.module("appQiSat", []);	

appQiSat.value("config", {
	baseUrl : "http://webservice.qisat.com:3000",
	imagensUrl : "http://webservice.qisat.com:3000/imagens/instrutores/",
	imagensUrlDefault : "http://webservice.qisat.com:3000/imagens/instrutores/instrutor.png"
});

appQiSat.controller("appCtrlHome", 
			function($scope, QiSatAPI, config){
						$scope.instructors = [];
						QiSatAPI.getInstructorsTop()
								.then( function ( response ){
									var instructors = [];
									if(response.status == 200) instructors = response.data;
									instructors.map( function (instructor) {
										if(instructor)
											if(!instructor.imagem)
												instructor.imagem = config.imagensUrlDefault;
											else
												instructor.imagem = config.imagensUrl+instructor.imagem;
									});
									$scope.instructors = instructors;
								 });
			});


appQiSat.factory("QiSatAPI", function($http, config){

	var _getInstructorsTop = function () {
		return $http({ method: 'GET', url: config.baseUrl+'/instrutores/top'});
	};

	return {
		getInstructorsTop : _getInstructorsTop
	};

});