(function() {
  'use strict';

  angular
    .module('QiSatApp')
    .config( function ($locationProvider) {

                // use the HTML5 History API
                $locationProvider.html5Mode({
                                              enabled: true, 
                                              requireBase: false,
                                              rewriteLinks: 'internal'
                                            });      

                // $locationProvider.html5Mode(true).hashPrefix('!');            
            });
})();