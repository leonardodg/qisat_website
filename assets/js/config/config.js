var QiSatApp = angular.module('QiSatApp');

QiSatApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
				    function($stateProvider, $urlRouterProvider, $locationProvider) {
						      // $urlRouterProvider.otherwise('/');

						      $stateProvider
								      .state('index', {
								        url: '/',
								        views: {
										            'instructors@': { 
										                templateUrl: './views/instructors.html',
										               	controller : 'instructorsController as self'
										            },

										            'header@' : {
										            		templateUrl: './views/header.html'
										            },

										            'footer@' : {
										            		templateUrl: './views/footer.html'
										            }
										        }
											        
								    	})
									      .state('cursos',{ absolute: true});
			    			
			    			  // $locationProvider.html5Mode({ enabled: true, requireBase: true }).hashPrefix('!');
			    			  // $locationProvider.html5Mode({ enabled: true, requireBase: true });
			    			  $locationProvider.html5Mode(true);
			    			}]);