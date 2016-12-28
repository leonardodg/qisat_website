(function () {
  "use strict";

  angular
    .module('QiSatApp')
    .directive('lightbox', ['$timeout', function (timer) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                var init = function(){
                    var elems = elem.find("a");
                    elems.simpleLightbox();
                }
                timer(init, 0);
            }
        }
    }]);

}());