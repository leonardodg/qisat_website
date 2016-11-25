(function () {
  "use strict";

  angular
    .module('QiSatApp')
        .directive('reCapthcha', [function () {
                        var ddo = {
                            restrict: 'AE',
                            scope: {},
                            require: 'ngModel',
                            link: link,
                        };
                        return ddo;

                        function link(scope, elm, attrs, ngModel) {
                            var id;
                            ngModel.$validators.captcha = function(modelValue, ViewValue) {
                                // if the viewvalue is empty, there is no response yet,
                                // so we need to raise an error.
                                return !!ViewValue;
                            };

                            function update(response) {
                                ngModel.$setViewValue(response);
                                ngModel.$render();
                            }
                            
                            function expired() {
                                grecaptcha.reset(id);
                                ngModel.$setViewValue('');
                                ngModel.$render();
                                // do an apply to make sure the  empty response is 
                                // proaganded into your models/view.
                                // not really needed in most cases tough! so commented by default
                                // scope.$apply();
                            }

                            function iscaptchaReady() {
                                if (typeof grecaptcha !== "object") {
                                    // api not yet ready, retry in a while
                                    return setTimeout(iscaptchaReady, 250);
                                }
                                id = grecaptcha.render(
                                    elm[0], {
                                        // put your own sitekey in here, otherwise it will not
                                        // function.
                                        "sitekey": "xxx",
                                        callback: update,
                                        "expired-callback": expired
                                    }
                                );
                            }
                            iscaptchaReady();
                        }
                    }]);
}());