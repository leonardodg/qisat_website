(function () {
  "use strict";

  angular
    .module('QiSatApp')
    .directive('hrefPortal', [ 'authService', function (authService) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                if(authService.isAuth() || authService.isLogged())
                    attrs.$set('href',"/aluno");
                else
                    attrs.$set('href',"/login");
            }
        }
    }]);

}());