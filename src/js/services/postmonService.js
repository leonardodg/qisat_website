(function () {
  "use strict";

  angular
  	.module('QiSatApp')
  	.service('postmon', ['$http', function($http){

        var _getCEP = function(cep){
        
                        return $http({ 
                                        method: 'GET',
                                        url: 'https://api.postmon.com.br/cep/'+cep,
                                              dataType: 'jsonp',
                                              headers: {
                                                  'Content-Type': undefined
                                                }

                              }).then(function(res){
                                return res.data;
                              });
                      };

        return {
        	getCEP : _getCEP
        };
  	}]);
  
}());