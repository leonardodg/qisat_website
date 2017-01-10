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
                            if(!ctrl.$error.pattern && !ctrl.$error.required){
                                QiSatAPI.checkByEmail(ctrl.$viewValue).then(function(res){
                                    if(res.data && res.data.success && !res.data.check)
                                        ctrl.$setValidity('emailCheck', true); //no error
                                    else if(res.data && res.data.success && res.data.check){
                                        ctrl.$setValidity('emailCheck', false); //yes error
                                    }
                                    else
                                        console.log(res); // verificar
                                });
                                
                            }
                        });
                    });
                
            }
        }
    }]);
  
}());