var appQiSat = angular.module("appQiSat", ['ngRoute']);	

appQiSat.value("config", {
	baseUrl : "http://webservice.qisat.com:3000",
	imagensUrl : "http://webservice.qisat.com:3000/imagens/instrutores/",
	imagensUrlDefault : "http://webservice.qisat.com:3000/imagens/instrutores/instrutor.png"
});

 appQiSat.config( ['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'view/instructors.html',
          controller: 'HomeController',
          controllerAs : 'dados'
        })
        .otherwise({
          redirectTo: '/index.html'
        });

        $locationProvider.html5Mode( true );
    	// $locationProvider.html5Mode({ enabled: true, requireBase: false});

    }]);

appQiSat.controller("HomeController", 
			function($scope, QiSatAPI, config){
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

											if(instructor.redes_sociais){
												instructor.linkedin = instructor.redes_sociais.find(function(el){
														return el.descricao == 'Linkedin';
												});
											}

									});
									$scope.dados.instructors = instructors;
								 });
			});

appQiSat.controller("appCtrlMetatags", function($scope, QiSatAPI, config){ 

});


appQiSat.factory("QiSatAPI", function($http, config){

	var _getInstructorsTop = function () {
		return $http({ method: 'GET', url: config.baseUrl+'/instrutores/top'});
	};

	return {
		getInstructorsTop : _getInstructorsTop
	};

});