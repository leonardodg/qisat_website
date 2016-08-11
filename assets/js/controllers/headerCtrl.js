var QiSatApp = angular.module('QiSatApp');

/* Link Ativo no HEADER */
QiSatApp.controller("headerCtrl",
						function(){
							var path = window.location.pathname;
							if(path == '/'){
								angular.element('.header-main__list[data-linkA="home"]').addClass('header-main__list-current');
							}else if( path.toLowerCase().indexOf('/cursos') >= 0 ){
								angular.element('.header-main__list[data-linkA="cursos"]').addClass('header-main__list-current');
							}else if( path.toLowerCase().indexOf('/aluno') >= 0 ){
								angular.element('.header-main__list[data-linkA="aluno"]').addClass('header-main__list-current');
							}else if( path.toLowerCase().indexOf('/institucional') >= 0 ){
								angular.element('.header-main__list[data-linkA="institucional"]').addClass('header-main__list-current');
							}
					});