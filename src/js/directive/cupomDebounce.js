(function () {
    "use strict";
  
    angular
      .module('QiSatApp')
      .directive('cupomDebounce', ['$timeout', function($timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            transclude: true,
            scope: { valid:'&cupomValid' },
            link: function(scope, elm, attr, ctrl) {
              if (attr.type === 'radio' || attr.type === 'checkbox') return;

              elm.unbind('input');
        
              var debounce;
              var valid = scope.valid();

              elm.bind('input', function() {
                 $timeout.cancel(debounce);
                debounce = $timeout( function() {
                    ctrl.$setViewValue(elm.val());
                    valid(elm.val());
                }, attr.cupomDebounce || 1000);
              });
              elm.bind('blur', function() {
                scope.$apply(function() {
                    ctrl.$setViewValue(elm.val());
                    valid(elm.val());
                });
              });
            }
          }
      }]);
  
  }());