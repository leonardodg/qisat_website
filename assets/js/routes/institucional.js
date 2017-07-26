(function() {
  'use strict';

  angular
    .module('QiSatApp')
    .config([ '$httpProvider', '$locationProvider', '$routeProvider',
          function ( $httpProvider, $locationProvider, $routeProvider ) {
            $locationProvider.html5Mode(true); 
            $locationProvider.hashPrefix('!');

            function aboutController ($scope, $location, $analytics, QiSatAPI){
                  $scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,6}$/;
                  $scope.submitted = false;
                  $scope.isDisabled = true;
                  $analytics.pageTrack($location.path());
                  $scope.solicitarIdentidade = function(){
                      $scope.submitted = true;
                      if($scope.email){
                        $scope.isDisabled = false;
                        QiSatAPI.identidadeVisual($scope.email).then(function (res){
                            if(res && res.data && res.data.retorno && res.data.retorno.sucesso){
                              $scope.submitted = false;
                              $scope.isDisabled = true;
                              delete($scope.email);
                              $scope.visualForm.$setPristine();
                            }
                        });
                      }
                  }
              };

              function descontosConvenio ($location, $analytics, QiSatAPI){
                          $analytics.pageTrack($location.path());
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
              };

              function institutions ($location, $analytics, QiSatAPI, $filter){
                          $analytics.pageTrack($location.path());
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
              };


              function allController($location, $analytics){
                        $analytics.pageTrack($location.path());
              };

            $routeProvider.when('/institucional', {
              templateUrl : '/views/institucional-sobre-a-empresa.html',
              controller : aboutController
            });

            $routeProvider.when('/institucional/sobre-a-empresa', {
              templateUrl : '/views/institucional-sobre-a-empresa.html', 
              controller : aboutController
            });

            $routeProvider.when('/institucional/linha-do-tempo', {
              templateUrl : '/views/institucional-linha-do-tempo.html',
              controller : allController
            });
            
            $routeProvider.when('/institucional/convenios-e-parceiros', {
               templateUrl : '/views/institucional-parceiros.html',
               controller : allController
            });

            $routeProvider.when('/institucional/parceiros', {
              templateUrl : '/views/institucional-parceiros.html',
              controller : allController
            });

            $routeProvider.when('/institucional/convenios/conselhos', {
              templateUrl : '/views/institucional-conselhos-cadastro.html',
              controller : 'convenioController as vm'
            });

            $routeProvider.when('/institucional/convenios/conselhos/conveniados', {
              templateUrl : '/views/institucional-conselhos-conveniados.html',
            });

            $routeProvider.when('/institucional/convenios/conselhos/desconto', {
                    templateUrl : '/views/institucional-conselhos-desconto.html',
                    controller : 'descontosConvenioController',
                    resolve : { descontosConvenio : descontosConvenio }
            });

            $routeProvider.when('/institucional/convenios/preduc/ensino', {
              templateUrl : '/views/institucional-preduc-ensino.html',
              controller : 'convenioController as vm'
            });

            $routeProvider.when('/institucional/convenios/preduc/entidade', {
              templateUrl : '/views/institucional-preduc-entidade.html',
              controller : 'convenioController as vm'
            });

            $routeProvider.when('/institucional/convenios/preduc/descontos', {
                    templateUrl : '/views/institucional-preduc-descontos.html',
                    controller : 'descontosConvenioController',
                    resolve : { descontosConvenio : descontosConvenio }
            });

            $routeProvider.when('/institucional/convenios/preduc/conveniadas', {
                  templateUrl : '/views/institucional-preduc-conveniadas.html',
                  controller :  function($scope, $location, $analytics, Config, institutions){
                                $analytics.pageTrack($location.path());
                                $scope.states = Config.states;
                                $scope.institutions = institutions;
                  },
                  resolve : { institutions : institutions }
            });

            $routeProvider.when('/institucional/convenios/preduc/inscricao', {
                  templateUrl : '/views/institucional-preduc-inscricao.html',
                  controller :  function($scope, $location, $analytics, $controller, Config, QiSatAPI, institutions){
                                  var modalController = $controller('modalController');
                                    $scope.states = Config.states;
                                    $scope.selectInstitution = institutions;
                                    $analytics.pageTrack($location.path());

                                  $scope.institutionDiscount = function(){
                                    var data = angular.copy($scope.desconto)

                                    if($scope.descontoForm && $scope.descontoForm.$valid){
                                      $scope.send = true;
                                      data.ecm_convenio_id = data.institution.id;
                                      delete(data.institution);

                                      QiSatAPI.addInteresse(data)
                                            .then( function ( response ){
                                                  $scope.send = false;

                                                if(response.data.retorno.sucesso){
                                                  $scope.desconto = {};
                                                  $scope.descontoForm.$setPristine();
                                                  modalController.alert({ success : true, main : { title : "Obrigado, por solicitar o Insteresse!", subtitle : " Em breve entraremos em contato." } });
                                                }else
                                                  modalController.alert({ error : true, main : { title : "Falha na Solicitação!" }});
                                                
                                              }, function ( response ){
                                                  modalController.alert();
                                              });
                                    }
                                  };
                                },
                  resolve : { institutions : institutions }
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
