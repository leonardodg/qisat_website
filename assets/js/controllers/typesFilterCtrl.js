var QiSatApp = angular.module('QiSatApp');


QiSatApp.controller("typesFilterCtrl",
			function($scope,$location, QiSatAPI, Config ){
				var path = window.location.pathname;
				var filter, els;

				if( path.indexOf('/online') >= 0){
					filter = Config.filter.online;
				}else if( path.indexOf('/presenciais') >= 0){
					filter = Config.filter.presencial;
				}else if( path.indexOf('/cursos') >= 0){
					filter = Config.filter.online;
				}

				//els = filter.filter(function(el){ return el.type == 'checkbox' });
				//els.map(function(el){ el.inputs.map(function(item){ item.checked = true }) });

				$scope.filters = filter;

			});