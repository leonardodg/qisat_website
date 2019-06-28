(function () {
    "use strict";

    angular
        .module('QiSatApp')
        .directive('backImgInstructor', ['Config', function (Config) {

            function link(scope, element, attrs) {
                var url = attrs.backImgInstructor;
                if (url == '') {
                    attrs.$observe('backImgInstructor', function (val) {
                        if (val != '') {
                            element.css({ 'background-image': 'url("' + val + '")' });
                            element.removeClass(Config.imagens.classInstructor);
                        }
                    });

                    element.addClass(Config.imagens.classInstructor);
                } else {
                    element.css({ 'background-image': 'url("' + url + '")' });
                }
            }

            return ({
                link: link
            });

        }]);

}());