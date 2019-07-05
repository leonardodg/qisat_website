(function () {
    "use strict";

    angular
        .module('QiSatApp').directive('typeaheadMatch', ['$http', '$templateCache', '$compile', '$parse', function ($http, $templateCache, $compile, $parse) {
            return {
                restrict: 'EA',
                scope: {
                    index: '=',
                    match: '=',
                    query: '='
                },
                qisat: true,
                link: function (scope, element, attrs) {
                    var tplUrl = $parse(attrs.templateUrl)(scope.$parent) || 'template/typeahead/typeahead-match.html';
                    $http.get(tplUrl, { cache: $templateCache }).then(function (tplContent) {
                        element.replaceWith($compile(tplContent.data.trim())(scope));
                    });
                }
            };
        }])
        .directive('accordionGroup', ['$parse', function ($parse) {
            return {
                require: '^accordion',         // We need this directive to be inside an accordion
                restrict: 'EA',
                transclude: true,              // It transcludes the contents of the directive into the template
                replace: true,                // The element containing the directive will be replaced with the template
                templateUrl: 'template/accordion/accordion-group.html',
                scope: { heading: '@', modal: '&', addCarrinho: '&', playDemoModal: '@', iconCarrinho: '@' },        // Create an isolated scope and interpolate the heading attribute onto this scope
                qisat: true,
                controller: function () {
                    this.setHeading = function (element) {
                        this.heading = element;
                    };
                },
                link: function (scope, element, attrs, accordionCtrl) {
                    var getIsOpen, setIsOpen;

                    accordionCtrl.addGroup(scope);

                    scope.isOpen = false;
                    scope.modal = attrs.modal;

                    if (attrs.isOpen) {
                        getIsOpen = $parse(attrs.isOpen);
                        setIsOpen = getIsOpen.assign;

                        scope.$parent.$watch(getIsOpen, function (value) {
                            scope.isOpen = !!value;
                        });
                    }

                    scope.$watch('isOpen', function (value) {
                        if (value) {
                            accordionCtrl.closeOthers(scope);
                        }
                        if (setIsOpen) {
                            setIsOpen(scope.$parent, value);
                        }
                    });
                }
            };
        }]);

    angular
        .module("template/accordion/accordion-group.html", []).run(["$templateCache", function ($templateCache) {
            $templateCache.put("template/accordion/accordion-group.html",
                "<dd>\n" +
                " <div ng-click=\"modal(playDemoModal, 'videoDemo')\" class=\"iconPlay\" ng-if=\"playDemoModal\">  <i class=\"material-icons\">play_circle_outline</i> </div>\n" +
                " <a ng-click=\"isOpen = !isOpen\" ng-class=\"{ active: isOpen }\"  accordion-transclude=\"heading\">\n" +
                "{{heading}}" +
                "</a>\n" +

                "<ul class=\"button-group radius hero-course__buttons-group\" ng-if=\"iconCarrinho\" ><li class=\"hero-course__buttons-group--item\"><div ng-click=\"addCarrinho()\" class=\"addProduto has-price_popover\" ><span class=\"cart\"><i class=\"material-icons\">shopping_cart</i></span><span class=\"card-course__icon-cart\"><div class=\"price_popover\"><div class=\"price_popover__header\"><p class=\"price_popover__header__info\"> <strong> Adicionar capítulo individual </strong> </p></div><div class=\"price_popover__footer\"> {{iconCarrinho}} </div></div></span></div></li></ul>\n" +

                " <div class=\"content\" ng-class=\"{ active: isOpen }\" ng-transclude></div>\n" +
                "</dd>\n" +
                "");
        }]);

    angular.module("QiSatApp").decorator(
        "accordionGroupDirective",
        ['$delegate', function accordionGroupDirectiveDecorator($delegate) {
            var getDirective = $delegate.find(function (el) { return el.qisat });
            return ([getDirective]);
        }]
    );

    angular.module("QiSatApp").decorator(
        "typeaheadMatchDirective",
        ['$delegate', function typeaheadMatchDirectiveDecorator($delegate) {
            var getDirective = $delegate.find(function (el) { return el.qisat });
            return ([getDirective]);
        }]
    );

}());