var QiSatApp = angular.module('QiSatApp');

QiSatApp.directive('backImg', function(){
    return function(scope, element, attrs){
        var url = attrs.backImg;
        element.css({
            'background-image' : 'url(' + url +')'
        });
    };
});