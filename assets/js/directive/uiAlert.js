(function () {
  "use strict";

  angular
    .module('QiSatApp')
        .directive('uiAlert', [function () {
            return {
                templateUrl : "../../../views/alert.html",
                restrict : "AE",
                scope : {
                    type : "@",
                    close : "@"
                },
                transclude : true
            }
        }]);
  
}());