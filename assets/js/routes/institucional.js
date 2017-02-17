(function() {
  'use strict';

  angular
    .module('QiSatApp')
    .config([ '$httpProvider', '$locationProvider', '$routeProvider',
          function ( $httpProvider, $locationProvider, $routeProvider ) {
            $locationProvider.html5Mode(true); 

            $routeProvider.when('/institucional', {
              templateUrl : '/views/institucional-sobre-a-empresa.html'
            });

            $routeProvider.when('/institucional/sobre-a-empresa', {
              templateUrl : '/views/institucional-sobre-a-empresa.html'
            });

            $routeProvider.when('/institucional/linha-do-tempo', {
              templateUrl : '/views/institucional-linha-do-tempo.html'
            });
            
            $routeProvider.when('/institucional/convenios-e-parceiros', {
               templateUrl : '/views/institucional-parceiros.html'
            });

            $routeProvider.when('/institucional/parceiros', {
              templateUrl : '/views/institucional-parceiros.html'
            });

            $routeProvider.when('/institucional/convenios/conselhos', {
              templateUrl : '/views/institucional-conselhos-conveniados.html'
            });

            $routeProvider.when('/institucional/convenios/conselhos/cadastro', {
              templateUrl : '/views/institucional-conselhos-cadastro.html',
              controller : 'convenioController'
            });

            $routeProvider.when('/institucional/convenios/conselhos/desconto', {
              templateUrl : '/views/institucional-conselhos-desconto.html',
              controller : 'descontosConvenioController',
              resolve : {
                    descontosConvenio : function (QiSatAPI){
                          return QiSatAPI.descontoConvenio().then( function ( res ){
                                    if(res && res.sucesso){
                                        var result = { cursosSoftware : [], cursosTeoricos : [] };
                                        angular.forEach(res.software, function(value) {
                                            result.cursosSoftware.push(value);
                                        });

                                        angular.forEach(res.teoricos, function(value) {
                                          result.cursosTeoricos.push(value);
                                        });

                                        return result;
                                    }
                                });
                      }
                  }
            });

            $routeProvider.when('/institucional/convenios/preduc/ensino', {
              templateUrl : '/views/institucional-preduc-ensino.html',
              controller : 'convenioController'
            });

            $routeProvider.when('/institucional/convenios/preduc/entidade', {
              templateUrl : '/views/institucional-preduc-entidade.html',
              controller : 'convenioController'
            });

            $routeProvider.when('/institucional/convenios/preduc/descontos', {
              templateUrl : '/views/institucional-preduc-descontos.html',
              controller : 'descontosConvenioController',
              resolve : {
                    descontosConvenio : function (QiSatAPI){
                          return QiSatAPI.descontoConvenio().then( function ( res ){
                                    if(res && res.sucesso){
                                        var result = { cursosSoftware : [], cursosTeoricos : [] };
                                        angular.forEach(res.software, function(value) {
                                            result.cursosSoftware.push(value);
                                        });

                                        angular.forEach(res.teoricos, function(value) {
                                          result.cursosTeoricos.push(value);
                                        });

                                        return result;
                                    }
                                });
                      }
                  }
            });

            $routeProvider.when('/institucional/convenios/preduc/conveniadas', {
              templateUrl : '/views/institucional-preduc-conveniadas.html',
              controller :  function($scope,  Config, institutions){
                            $scope.states = Config.states;
                            $scope.institutions = institutions;
              },

              resolve : {
                    institutions : function (QiSatAPI, $filter){
                          return QiSatAPI.getConvenios()
                                         .then( function ( response ){
                                                var data = [];
                                                if(response.status == 200) 
                                                  data = response.data.retorno.ecmConvenio;
                                                data.map(function (el){
                                                  el.dataFim = $filter('date')( el.timeend*1000, 'dd/MM/yy' );
                                                });
                                                return data;
                                          });
                      }
                  }
            });

            $routeProvider.when('/institucional/convenios/preduc/inscricao', {
              templateUrl : '/views/institucional-preduc-inscricao.html',
              controller :  function($scope,  Config, institutions){
                            $scope.states = Config.states;
                            $scope.selectInstitution = institutions;
              },

              resolve : {
                    institutions : function (QiSatAPI, $filter){
                          return QiSatAPI.getConvenios()
                                         .then( function ( response ){
                                                var data = [];
                                                if(response.status == 200) 
                                                  data = response.data.retorno.ecmConvenio;
                                                data.map(function (el){
                                                  el.dataFim = $filter('date')( el.timeend*1000, 'dd/MM/yy' );
                                                });
                                                return data;
                                          });
                      }
                  }
            });            

            $routeProvider.when('/institucional/instrutores-e-professores', {
              templateUrl : '/views/institucional-instrutores.html',
              controller : 'instructorsController',
              resolve : {
                instrutores : function (QiSatAPI){
                      return QiSatAPI.getInstructors()
                                    .then( function (res){ 
                                        if(res.status == 200 && res.data.retorno)
                                            return res.data.retorno;
                                      });
                  }
              }
            });

            $routeProvider.when('/institucional/instrutor/:id', {
              templateUrl : '/views/institucional-instrutor.html',
              controller : 'instructorController',
              resolve : {
                instrutor : function (QiSatAPI, $route){
                      return QiSatAPI.getInstructor($route.current.params.id)
                                    .then( function (res){ 
                                        if(res.status == 200 && res.data.retorno)
                                            return res.data.retorno;
                                      });
                  }
              }
            });

            $routeProvider.when('/institucional/contatos', {
              templateUrl : '/views/institucional-contatos.html',
               controller : 'contactController'
            });

            $routeProvider.otherwise('/institucional');
    }]);
})();
