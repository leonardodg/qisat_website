(function () {
  "use strict";

  angular
    .module('QiSatApp')
    .directive('emailCheck', ['QiSatAPI', function(QiSatAPI) {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function(scope, elem, attr, ctrl) {

                elem.on('blur', function () {
                        scope.$apply(function () {
                            if(scope.msgRemember)
                                scope.msgRemember = '';

                            if(!ctrl.$error.pattern && !ctrl.$error.required){
                                QiSatAPI.checkByEmail(ctrl.$viewValue).then(function(res){
                                     if(res.data && res.data.retorno && !res.data.retorno.sucesso)
                                        ctrl.$setValidity('emailCheck', true); //no error
                                    else if(res.data && res.data.retorno && res.data.retorno.sucesso){
                                        ctrl.$setValidity('emailCheck', false); //yes error
                                        scope.erroemail = res.data.retorno.mensagem;
                                    }
                                });
                                
                            }
                        });
                    });
                
            }
        }
    }]);
  
}());