(function () {
  "use strict";

  angular
    .module('QiSatApp')
    .directive('sticky', ['$timeout', function(timer) {
                return {
                    restrict: 'A',
                    link: function(scope, elem, attrs) {
                            var init = function(){
                                elem.stick_in_parent({
                                        offset_top: 80,
                                        recalc_every: 1
                                       });
                            };
                        timer(init, 0);
                    }
                }
    }]);

}());