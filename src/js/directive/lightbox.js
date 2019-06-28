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
                    elems.simpleLightbox({
                      captions: true,
                      widthRatio : 0.75,
                      heightRatio : 0.75
                    });
                }
                timer(init, 0);
            }
        }
    }]);

}());