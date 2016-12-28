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
              //templateUrl : '/views/institucional-convenios-parceiros.html', // PAGE COMPLETA
               templateUrl : '/views/institucional-parceiros.html',
              controller : 'convenioController'
            });

            $routeProvider.when('/institucional/parceiros', {
              templateUrl : '/views/institucional-parceiros.html',
              controller : 'convenioController'
            });

            $routeProvider.when('/institucional/convenios/conselhos', {
              templateUrl : '/views/institucional-conselhos.html',
              controller : 'convenioController'
            });

            $routeProvider.when('/institucional/convenios/conselhos/conveniados', {
              templateUrl : '/views/institucional-conselhos-conveniados.html',
              controller : 'convenioController'
            });

            $routeProvider.when('/institucional/convenios/conselhos/desconto', {
              templateUrl : '/views/institucional-conselhos-desconto.html',
              controller : 'convenioController'
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
              controller : 'convenioController'
            });

            $routeProvider.when('/institucional/convenios/preduc/conveniadas', {
              templateUrl : '/views/institucional-preduc-conveniadas.html',
              controller : 'convenioController'
            });

            $routeProvider.when('/institucional/convenios/preduc/inscricao', {
              templateUrl : '/views/institucional-preduc-inscricao.html',
              controller : 'convenioController'
            });            

            $routeProvider.when('/institucional/instrutores-e-professores', {
              templateUrl : '/views/institucional-instrutores.html'
            });

            $routeProvider.when('/institucional/contatos', {
              templateUrl : '/views/institucional-contatos.html',
               controller : 'contactController'
            });

            $routeProvider.otherwise('/institucional');
    }]);
})();