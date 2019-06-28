(function () {
  "use strict";

  angular
    .module('QiSatApp')
    .directive('cpfCheck', ['QiSatAPI', function(QiSatAPI) {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function(scope, elem, attr, ctrl) {
                elem.on('blur', function () {
                        scope.$apply(function () {
                            if(!ctrl.$error.cpf && !ctrl.$error.cnpj && !ctrl.$error.required){
                                QiSatAPI.checkByCPF(ctrl.$viewValue).then(function(res){
                                    if(res.data && res.data.retorno && res.data.retorno.sucesso)
                                        ctrl.$setValidity('cpfCheck', true); //no error
                                    else if(res.data && res.data.retorno && !res.data.retorno.sucesso){
                                        ctrl.$setValidity('cpfCheck', false); //yes error
                                        scope.errocpf = res.data.retorno.mensagem;
                                    }
                                });
                                
                            }
                        });
                    });
                
            }
        }
    }]);
  
}());