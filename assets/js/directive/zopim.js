(function () {
  "use strict";

  angular
    .module('QiSatApp')
    .directive('zopim',  ['$timeout', function (timer) {
                return {
                    restrict: 'A',
                    link: function(scope, $elm, attrs) {
                            var init = function(){
                                    var element = document.createElement("script");
                                    element.src = "js/libs/zopim.js";
                                    document.body.appendChild(element);
                            };
                            timer(init, 0);
                    }
            }
        }]);

}());