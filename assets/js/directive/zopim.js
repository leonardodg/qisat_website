(function () {


  angular
    .module('QiSatApp')
    .directive('zopim',  ['$q', 'authService',  function ($q, authService) {
                return {
                    restrict: 'A',
                    link: function(scope, $elm, attrs) {
                            var body = angular.element(document).find('body');
                            
                            function load(){
                                var deferred = $q.defer();

                                window.$zopim||(function(d,s){var z=$zopim=function(c){z._.push(c)},$=z.s=
                                d.createElement(s),e=d.getElementsByTagName(s)[0];z.set=function(o){z.set.
                                _.push(o)};z._=[];z.set._=[];$.async=!0;$.setAttribute("charset","utf-8");
                                $.src="https://v2.zopim.com/?2jhFplrC6wQCc6t1tRCcVV3LZTuli01D";z.t=+new Date;$.
                                type="text/javascript";e.parentNode.insertBefore($,e)})(document,"script");

                                $zopim(function(){
                                    if (typeof($zopim.livechat) == 'object'){
                                            $zopim.livechat.theme.setColor('#005285');
                                            $zopim.livechat.theme.reload(); // apply new theme settings
                                            $zopim.livechat.hideAll();
                                            deferred.resolve();
                                    }else{
                                        result.reject();
                                    }
                                });

                                return deferred.promise;
                            };


                            $elm.on('click', function(event) { 
                                body.addClass('wait');

                                load().then(function(){
                                      var user = authService.getUser();
                                      $zopim.livechat
                                            .setOnConnected(function (){
                                                $zopim.livechat.departments.setVisitorDepartment(111831);

                                                if(user){
                                                    $zopim.livechat.set({
                                                          language: 'pt-br',
                                                          name: user.firstname+' '+user.lastname,
                                                          email: user.email,
                                                          phone: user.phone1
                                                        });
                                                }

                                                body.removeClass('wait');
                                                $zopim.livechat.window.show();
                                            });
                                })
                            });
                    }
            }
        }]);

}());