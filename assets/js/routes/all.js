(function() {
  'use strict';

  angular
    .module('QiSatApp')
    .config([ '$httpProvider', '$locationProvider', '$routeProvider',
          function ( $httpProvider, $locationProvider, $routeProvider ) {

            function aboutController ($scope, QiSatAPI){
                  $scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,6}$/;
                  $scope.submitted = false;
                  $scope.isDisabled = true;
                  $scope.solicitarIdentidade = function(){
                      $scope.submitted = true;
                      if($scope.email){
                        $scope.isDisabled = false;
                        QiSatAPI.identidadeVisual($scope.email).then(function (res){
                            if(res && res.data && res.data.retorno && res.data.retorno.sucesso){
                              $scope.submitted = false;
                              $scope.isDisabled = true;
                              delete($scope.email);
                              $scope.visualForm.$setPristine();
                            }
                        });
                      }
                  }
              };

              function descontosConvenio (QiSatAPI){
                          return QiSatAPI.descontoConvenio().then( function ( res ){
                                    if(res && res.sucesso){
                                        var result = { cursosSoftware : [], cursosTeoricos : [] };
                                        angular.forEach(res.software, function(value) {
                                            result.cursosSoftware.push(value);
                                        });

                                        angular.forEach(res.teoricos, function(value) {
                                          result.cursosTeoricos.push(value);
                                        });

                                        return result;
                                    }
                                });
              };

              function institutions (QiSatAPI, $filter){
                          return QiSatAPI.getConvenios()
                                         .then( function ( response ){
                                                var data = [];
                                                if(response.status == 200) 
                                                  data = response.data.retorno.ecmConvenio;
                                                data.map(function (el){
                                                  el.dataFim = $filter('date')( el.timeend*1000, 'dd/MM/yy' );
                                                });
                                                return data;
                                          });
              };

            $routeProvider.when('/', {
                templateUrl : '/views/index.html',
                seo : {
                        title : 'QiSat | Cursos aplicados à engenharia e arquitetura',
                        robots : 'follow,index',
                        description : 'Canal de cursos online focado em projetos prediais estruturais, elétricos, hidráulicos e agronômicos. Marca oficial de treinamento dos cursos AltoQi.',
                        keys : 'qisat, qi sat, curso projeto estrutural, curso software altoqi, projetos prediais, curso eberick, curso projetista eletrico, curso incendio, treinamento AltoQi, cursos AltoQi, cursos para Engenharia, curso Engenheiro',
                        url : 'https://www.qisat.com.br'
                      }
            })
            .when('/termos-de-uso', {
                templateUrl : '/views/modal-termo-de-uso.html',
                seo : {
                        title : 'Termos de Uso e Condições de Navegação - QiSat | Cursos aplicados à engenharia e arquitetura',
                        robots : 'nofollow,noindex',
                        description : 'A empresa apresenta aqui os Termos de Uso e Condições de Navegação de seu Portal, que deve ser respeitado pelos seus visitantes e usuários, sob pena de todas as implicações da legislação em vigor.',
                        keys : 'qisat, qi sat, curso projeto estrutural, curso software altoqi, projetos prediais, curso eberick, curso projetista eletrico, curso incendio, treinamento AltoQi, cursos AltoQi, cursos para Engenharia, curso Engenheiro',
                        url : 'https://www.qisat.com.br/termos-de-uso'
                      }
            })
            .when('/politica-de-privacidade', {
                templateUrl : '/views/modal-politica.html',
                seo : {
                        title : 'Política de Privacidade - QiSat | Cursos aplicados à engenharia e arquitetura',
                        robots : 'nofollow,noindex',
                        description : 'Como parte integrante dos Termos de Uso e Condições de Navegação do Portal da empresa, este documento denominado POLÍTICA DE PRIVACIDADE DA QISAT, tem por finalidade estabelecer as regras sobre obtenção, uso e armazenamento dos dados e informações coletadas dos visitantes e usuários, além do registro de suas atividades.',
                        keys : 'qisat, qi sat, curso projeto estrutural, curso software altoqi, projetos prediais, curso eberick, curso projetista eletrico, curso incendio, treinamento AltoQi, cursos AltoQi, cursos para Engenharia, curso Engenheiro',
                        url : 'https://www.qisat.com.br/politica-de-privacidade'
                      }
            })
            .when('/institucional', {
              templateUrl : '/views/institucional-sobre-a-empresa.html',
              controller : aboutController,
              seo : {
                        title : 'Sobre a Empresa - QiSat | Cursos aplicados à engenharia e arquitetura',
                        robots : 'nofollow,noindex',
                        description : 'O QiSat desenvolve e comercializa cursos online e presencial aplicados à engenharia e arquitetura. São 20 anos no mercado + de 60 cursos + de 51 mil matrículas.',
                        keys : 'qisat, qi sat, curso eberick, altoqi, eberick, curso de projetista eletrico, curso de alvenaria estrutural, curso hydros, altoqi cursos, curso projeto estrutural, treinamento AltoQi, cursos AltoQi, cursos para Engenharia, curso Engenheiro',
                        url : 'https://www.qisat.com.br/institucional/sobre-a-empresa'
                      }
            })
            .when('/institucional/sobre-a-empresa', {
              templateUrl : '/views/institucional-sobre-a-empresa.html',
              controller : aboutController,
              seo : {
                        title : 'Sobre a Empresa - QiSat | Cursos aplicados à engenharia e arquitetura',
                        robots : 'follow,index',
                        description : 'O QiSat desenvolve e comercializa cursos online e presencial aplicados à engenharia e arquitetura. São 20 anos no mercado + de 60 cursos + de 51 mil matrículas.',
                        keys : 'qisat, qi sat, curso eberick, altoqi, eberick, curso de projetista eletrico, curso de alvenaria estrutural, curso hydros, altoqi cursos, curso projeto estrutural, treinamento AltoQi, cursos AltoQi, cursos para Engenharia, curso Engenheiro',
                        url : 'https://www.qisat.com.br/institucional/sobre-a-empresa'
                      }
            })
            .when('/institucional/linha-do-tempo', {
              templateUrl : '/views/institucional-linha-do-tempo.html',
              seo : {
                        title : 'Linda do Tempo - QiSat | Cursos aplicados à engenharia e arquitetura',
                        robots : 'follow,index',
                        description : 'O QiSat atua na área da educação criando soluções inovadoras por meio de cursos online e presenciais promovendo capacitação continuada para engenheiros e arquitetos.',
                        keys : 'qisat, qi sat, curso eberick, altoqi, eberick, curso de projetista eletrico, curso de alvenaria estrutural, curso hydros, altoqi cursos, curso projeto estrutural, treinamento AltoQi, cursos AltoQi, cursos para Engenharia, curso Engenheiro, cursos para engenharia, cursos para projetos prediais, curso eberick presencial, curso online eberick, cursos altoqi, curso online',
                        url : 'https://www.qisat.com.br/institucional/linha-do-tempo'
                      }
            });
            
            $routeProvider.when('/institucional/convenios-e-parceiros', {
               templateUrl : '/views/institucional-parceiros.html',
               seo : {
                        title : 'Convênios e Parceiros - QiSat | Cursos aplicados à engenharia e arquitetura',
                        robots : 'follow,index',
                        description : 'O QiSat oferece benefícios para associados a Conselhos Regionais, Entidades de Classe e Universidades. Conheça os convênios. Solicite o convênio.',
                        keys : 'qisat, qi sat, curso eberick, altoqi, eberick, treinamento AltoQi, cursos AltoQi, benefícios para associados, Conselhos Regionais, Entidades de Classe, Universidades, CREA, CREARO, CREADF, CREABA, CREATO, CREASC, CREAMS, CREA-RO, CREA-DF, CREA-BA, CREA-TO, CREA-SC, CREA-MS, CREA RO, CREA DF, CREA BA, CREA TO, CREA SC, CREA MS',
                        url : 'https://www.qisat.com.br/institucional/convenios-e-parceiros'
                      }
            });

            $routeProvider.when('/institucional/parceiros', {
              templateUrl : '/views/institucional-parceiros.html',
              seo : {
                        title : 'Parceiros - QiSat | Cursos aplicados à engenharia e arquitetura',
                        robots : 'follow,index',
                        description : 'O QiSat oferece benefícios para associados a Conselhos Regionais, Entidades de Classe e Universidades. Conheça os convênios. Solicite o convênio.',
                        keys : 'qisat, qi sat, curso eberick, altoqi, eberick, treinamento AltoQi, cursos AltoQi, benefícios para associados, Conselhos Regionais, Entidades de Classe, Universidades, CREA, CREARO, CREADF, CREABA, CREATO, CREASC, CREAMS, CREA-RO, CREA-DF, CREA-BA, CREA-TO, CREA-SC, CREA-MS, CREA RO, CREA DF, CREA BA, CREA TO, CREA SC, CREA MS',
                        url : 'https://www.qisat.com.br/institucional/parceiros'
                      }
            });

            $routeProvider.when('/institucional/convenios/conselhos', {
              templateUrl : '/views/institucional-conselhos-cadastro.html',
              controller : 'convenioController as vm',
              seo : {
                        title : 'Conselhos Regionais - QiSat | Cursos aplicados à engenharia e arquitetura',
                        robots : 'follow,index',
                        description : 'O QiSat oferece benefícios para associados a Conselhos Regionais, Entidades de Classe e Universidades. Conheça os convênios. Solicite o convênio.',
                        keys : 'qisat, qi sat, curso eberick, altoqi, eberick, treinamento AltoQi, cursos AltoQi, benefícios para associados, Conselhos Regionais, Entidades de Classe, Universidades, CREA, CREARO, CREADF, CREABA, CREATO, CREASC, CREAMS, CREA-RO, CREA-DF, CREA-BA, CREA-TO, CREA-SC, CREA-MS, CREA RO, CREA DF, CREA BA, CREA TO, CREA SC, CREA MS',
                        url : 'https://www.qisat.com.br/institucional/convenios/conselhos'
                      }
            });

            $routeProvider.when('/institucional/convenios/conselhos/conveniados', {
              templateUrl : '/views/institucional-conselhos-conveniados.html',
              seo : {
                        title : 'Conselhos Regionais Conveniados - QiSat | Cursos aplicados à engenharia e arquitetura',
                        robots : 'follow,index',
                        description : 'O QiSat oferece benefícios para associados a Conselhos Regionais, Entidades de Classe e Universidades. Conheça os convênios. Solicite o convênio.',
                        keys : 'qisat, qi sat, curso eberick, altoqi, eberick, treinamento AltoQi, cursos AltoQi, benefícios para associados, Conselhos Regionais, Entidades de Classe, Universidades, CREA, CREARO, CREADF, CREABA, CREATO, CREASC, CREAMS, CREA-RO, CREA-DF, CREA-BA, CREA-TO, CREA-SC, CREA-MS, CREA RO, CREA DF, CREA BA, CREA TO, CREA SC, CREA MS',
                        url : 'https://www.qisat.com.br/institucional/convenios/conselhos/conveniados'
                      }
            });

            $routeProvider.when('/institucional/convenios/conselhos/desconto', {
                    templateUrl : '/views/institucional-conselhos-desconto.html',
                    controller : 'descontosConvenioController',
                    resolve : { descontosConvenio : descontosConvenio },
                    seo : {
                        title : 'Conselhos Regionais Desconto - QiSat | Cursos aplicados à engenharia e arquitetura',
                        robots : 'follow,index',
                        description : 'O QiSat oferece benefícios para associados a Conselhos Regionais, Entidades de Classe e Universidades. Conheça os convênios. Solicite o convênio.',
                        keys : 'qisat, qi sat, curso eberick, altoqi, eberick, treinamento AltoQi, cursos AltoQi, benefícios para associados, Conselhos Regionais, Entidades de Classe, Universidades, CREA, CREARO, CREADF, CREABA, CREATO, CREASC, CREAMS, CREA-RO, CREA-DF, CREA-BA, CREA-TO, CREA-SC, CREA-MS, CREA RO, CREA DF, CREA BA, CREA TO, CREA SC, CREA MS',
                        url : 'https://www.qisat.com.br/institucional/convenios/conselhos/desconto'
                      }
            });

            $routeProvider.when('/institucional/convenios/preduc/ensino', {
              templateUrl : '/views/institucional-preduc-ensino.html',
              controller : 'convenioController as vm',
              seo : {
                        title : 'Institucições de Ensino - QiSat | Cursos aplicados à engenharia e arquitetura',
                        robots : 'follow,index',
                        description : 'O QiSat oferece benefícios para associados a Conselhos Regionais, Entidades de Classe e Universidades. Conheça os convênios. Solicite o convênio.',
                        keys : 'qisat, qi sat, curso eberick, altoqi, eberick, treinamento AltoQi, cursos AltoQi, benefícios para associados, Conselhos Regionais, Entidades de Classe, Universidades, CREA, CREARO, CREADF, CREABA, CREATO, CREASC, CREAMS, CREA-RO, CREA-DF, CREA-BA, CREA-TO, CREA-SC, CREA-MS, CREA RO, CREA DF, CREA BA, CREA TO, CREA SC, CREA MS',
                        url : 'https://www.qisat.com.br/institucional/convenios/preduc/ensino'
                      }
            });

            $routeProvider.when('/institucional/convenios/preduc/entidade', {
              templateUrl : '/views/institucional-preduc-entidade.html',
              controller : 'convenioController as vm',
              seo : {
                        title : 'Entidades de Classe - QiSat | Cursos aplicados à engenharia e arquitetura',
                        robots : 'follow,index',
                        description : 'O QiSat oferece benefícios para associados a Conselhos Regionais, Entidades de Classe e Universidades. Conheça os convênios. Solicite o convênio.',
                        keys : 'qisat, qi sat, curso eberick, altoqi, eberick, treinamento AltoQi, cursos AltoQi, benefícios para associados, Conselhos Regionais, Entidades de Classe, Universidades, CREA, CREARO, CREADF, CREABA, CREATO, CREASC, CREAMS, CREA-RO, CREA-DF, CREA-BA, CREA-TO, CREA-SC, CREA-MS, CREA RO, CREA DF, CREA BA, CREA TO, CREA SC, CREA MS',
                        url : 'https://www.qisat.com.br/institucional/convenios/preduc/entidade'
                      }
            });

            $routeProvider.when('/institucional/convenios/preduc/descontos', {
                    templateUrl : '/views/institucional-preduc-descontos.html',
                    controller : 'descontosConvenioController',
                    resolve : { descontosConvenio : descontosConvenio },
                    seo : {
                        title : 'Descontos PREDUC - QiSat | Cursos aplicados à engenharia e arquitetura',
                        robots : 'follow,index',
                        description : 'O QiSat oferece benefícios para associados a Conselhos Regionais, Entidades de Classe e Universidades. Conheça os convênios. Solicite o convênio.',
                        keys : 'qisat, qi sat, curso eberick, altoqi, eberick, treinamento AltoQi, cursos AltoQi, benefícios para associados, Conselhos Regionais, Entidades de Classe, Universidades, CREA, CREARO, CREADF, CREABA, CREATO, CREASC, CREAMS, CREA-RO, CREA-DF, CREA-BA, CREA-TO, CREA-SC, CREA-MS, CREA RO, CREA DF, CREA BA, CREA TO, CREA SC, CREA MS',
                        url : 'https://www.qisat.com.br/institucional/convenios/preduc/descontos'
                      }
            });

            $routeProvider.when('/institucional/convenios/preduc/conveniadas', {
                  templateUrl : '/views/institucional-preduc-conveniadas.html',
                  controller :  function($scope, Config, institutions){
                                $scope.states = Config.states;
                                $scope.institutions = institutions;
                  },
                  resolve : { institutions : institutions },
                  seo : {
                        title : 'Entidades de Classe e Universidades Conveniadas - QiSat | Cursos aplicados à engenharia e arquitetura',
                        robots : 'follow,index',
                        description : 'O QiSat oferece benefícios para associados a Conselhos Regionais, Entidades de Classe e Universidades. Conheça os convênios. Solicite o convênio.',
                        keys : 'qisat, qi sat, curso eberick, altoqi, eberick, treinamento AltoQi, cursos AltoQi, benefícios para associados, Conselhos Regionais, Entidades de Classe, Universidades, CREA, CREARO, CREADF, CREABA, CREATO, CREASC, CREAMS, CREA-RO, CREA-DF, CREA-BA, CREA-TO, CREA-SC, CREA-MS, CREA RO, CREA DF, CREA BA, CREA TO, CREA SC, CREA MS',
                        url : 'https://www.qisat.com.br/institucional/convenios/preduc/conveniadas'
                      }
            });

            $routeProvider.when('/institucional/convenios/preduc/inscricao', {
                  templateUrl : '/views/institucional-preduc-inscricao.html',
                  controller :  function($scope, $controller, Config, QiSatAPI, institutions){
                                  var modalController = $controller('modalController');
                                    $scope.states = Config.states;
                                    $scope.selectInstitution = institutions;
                                    $scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,6}$/;

                                  $scope.institutionDiscount = function(){
                                    var data = angular.copy($scope.desconto)

                                    if($scope.descontoForm && $scope.descontoForm.$valid){
                                      $scope.send = true;
                                      data.ecm_convenio_id = data.institution.id;
                                      delete(data.institution);

                                      QiSatAPI.addInteresse(data)
                                            .then( function ( response ){
                                                  $scope.send = false;

                                                if(response.data.retorno.sucesso){
                                                  $scope.desconto = {};
                                                  $scope.descontoForm.$setPristine();
                                                  modalController.alert({ success : true, main : { title : "Obrigado, por solicitar o Insteresse!", subtitle : " Em breve entraremos em contato." } });
                                                }else
                                                  modalController.alert({ error : true, main : { title : "Falha na Solicitação!" }});
                                                
                                              }, function ( response ){
                                                  modalController.alert({error : true});
                                              });
                                    }
                                  };
                                },
                  resolve : { institutions : institutions },
                  seo : {
                        title : 'Solicitar Desconto PREDUC - QiSat | Cursos aplicados à engenharia e arquitetura',
                        robots : 'follow,index',
                        description : 'O QiSat oferece benefícios para associados a Conselhos Regionais, Entidades de Classe e Universidades. Conheça os convênios. Solicite o convênio.',
                        keys : 'qisat, qi sat, curso eberick, altoqi, eberick, treinamento AltoQi, cursos AltoQi, benefícios para associados, Conselhos Regionais, Entidades de Classe, Universidades, CREA, CREARO, CREADF, CREABA, CREATO, CREASC, CREAMS, CREA-RO, CREA-DF, CREA-BA, CREA-TO, CREA-SC, CREA-MS, CREA RO, CREA DF, CREA BA, CREA TO, CREA SC, CREA MS',
                        url : 'https://www.qisat.com.br/institucional/convenios/preduc/inscricao'
                      }
            });            

            $routeProvider.when('/institucional/instrutores-e-professores', {
              templateUrl : '/views/institucional-instrutores.html',
              controller : 'instructorsController',
              resolve : {
                instrutores : function (QiSatAPI){
                      return QiSatAPI.getInstructors()
                                    .then( function (res){ 
                                        if(res.status == 200 && res.data.retorno)
                                            return res.data.retorno;
                                      });
                  }
              },
              seo : {
                        title : 'Instrutores e Professores - QiSat | Cursos aplicados à engenharia e arquitetura',
                        robots : 'follow,index',
                        description : 'Conheça os instrutores e professores QiSat. Filtre por nome ou área de atuação. Conheça os cursos aplicados à engenharia e arquitetura. Entre em contato.',
                        keys : 'instrutor eberick, professor eberick, rodrigo koerich,  rodrigo koerich eberick, enio padilha, stephane vannier, francisco qieletrico, julian silva',
                        url : 'https://www.qisat.com.br/institucional/instrutores-e-professores'
                      }
            });

            $routeProvider.when('/institucional/instrutor/:id', {
              templateUrl : '/views/institucional-instrutor.html',
              controller : 'instructorController',
              resolve : {
                instrutor : function (QiSatAPI, $route){
                      return QiSatAPI.getInstructor($route.current.params.id)
                                    .then( function (res){ 
                                        if(res.status == 200 && res.data.retorno)
                                            return res.data.retorno;
                                      });
                  }
              },
              seo : {
                        title : 'Página do Instrutor - QiSat | Cursos aplicados à engenharia e arquitetura',
                        robots : 'nofollow,noindex',
                        description : 'Conheça os instrutores e professores QiSat. Filtre por nome ou área de atuação. Conheça os cursos aplicados à engenharia e arquitetura.',
                        keys : 'instrutor eberick, professor eberick, rodrigo koerich,  rodrigo koerich eberick, enio padilha, stephane vannier, francisco qieletrico, julian silva',
                        url : 'https://www.qisat.com.br/institucional/instrutor'
                      }
            });

            $routeProvider.when('/institucional/contatos', {
              templateUrl : '/views/institucional-contatos.html',
               controller : 'contactController',
               seo : {
                        title : 'Entre em Contato - QiSat | Cursos aplicados à engenharia e arquitetura',
                        robots : 'follow, index',
                        description : 'Solicite contato por um dos canais de atendimento QiSat. Envie suas dúvidas sobre os cursos,  críticas, sugestões ou solicite auxílio para efetuar sua inscrição.',
                        keys : 'qisat, contato qisat, qi sat, telefone qisat, chat qisat, numero qisat, orçamento qisat, suporte qisat, inscrição curso eberick, preço curso eberick, cursos altoqi, atendimento qisat, endereço qisat, ligamos pra você qisat',
                        url : 'https://www.qisat.com.br/institucional/contatos'
                      }
            });


            $routeProvider.when('/carrinho', {
              templateUrl : '/views/carrinho-montar.html',
              controller : 'montarCarrinhoController as vm',
              seo : {
                        title : 'Carrinho de Compras - QiSat | Cursos aplicados à engenharia e arquitetura',
                        robots : 'nofollow, noindex',
                        description : 'Seja bem vindo ao carrinho de compras da QiSat. Acesse e aproveite! Aqui você encontra os mais variados cursos online e presenciais para engenharia e arquitetura.',
                        keys : 'qisat, curso eberick, curso eberick preço, preço eberick, curso online eberick, curso de projeto, curso alvenaria estrutural, curso incendio, curso projeto eletrico',
                        url : 'https://www.qisat.com.br/carrinho'
                      }
            });

            $routeProvider.when('/carrinho/pagamento', {
              templateUrl : '/views/carrinho-pagamento.html',
              controller : 'pagamentoController as vm',
              resolve : {
                  Authenticated : function(authService){
                      return authService.Authenticated('/carrinho');
                  },
                  Itens : function(carrinhoServive){
                          if(carrinhoServive.checkCarrinho() && !carrinhoServive.checkItens()){
                              return carrinhoServive.getCarrinho()
                                             .then(function (res){
                                                    return carrinhoServive.getItens();
                                              });
                          }else         
                              return carrinhoServive.getItens();
                  },
                  formasPagamentos : function (carrinhoServive){
                         return carrinhoServive.getFormas()
                                         .then(function (formas){ 
                                            return formas;
                                          });
                  }
              },
              seo : {
                        title : 'Carrinho de Compras - QiSat | Cursos aplicados à engenharia e arquitetura',
                        robots : 'nofollow, noindex',
                        description : 'Seja bem vindo ao carrinho de compras da QiSat. Acesse e aproveite! Aqui você encontra os mais variados cursos online e presenciais para engenharia e arquitetura.',
                        keys : 'qisat, curso eberick, curso eberick preço, preço eberick, curso online eberick, curso de projeto, curso alvenaria estrutural, curso incendio, curso projeto eletrico',
                        url : 'https://www.qisat.com.br/carrinho'
                      }
            });

            $routeProvider.when('/carrinho/confirmacao/:id', {
              templateUrl : '/views/carrinho-confirmacao.html',
              controller : 'confirmacaoController as vm',
              resolve : {
                  Authenticated : function(authService, $location){
                      return authService.Authenticated('/carrinho');
                  },
                  venda : function (carrinhoServive, $route){
                          if(carrinhoServive.checkCarrinho())
                              return carrinhoServive.getVenda($route.current.params.id)
                                           .then(function (res){ 
                                              if(res.sucesso)
                                                return res.venda;
                                            });
                          else
                               return false;
                    }
              },
              seo : {
                        title : 'Carrinho de Compras - QiSat | Cursos aplicados à engenharia e arquitetura',
                        robots : 'nofollow, noindex',
                        description : 'Seja bem vindo ao carrinho de compras da QiSat. Acesse e aproveite! Aqui você encontra os mais variados cursos online e presenciais para engenharia e arquitetura.',
                        keys : 'qisat, curso eberick, curso eberick preço, preço eberick, curso online eberick, curso de projeto, curso alvenaria estrutural, curso incendio, curso projeto eletrico',
                        url : 'https://www.qisat.com.br/carrinho'
                      }

            });


            $routeProvider.when('/curso/online/:cat/:nome', {
              templateUrl : '/views/info.html',
              controller : 'infoController as vm',
              resolve : {
                    Info : function ($rootScope, QiSatAPI, $route){
                              return QiSatAPI.getInfo ('curso/online/'+$route.current.params.cat+"/"+$route.current.params.nome)
                                             .then(function (info){
                                                   if(info)
                                                      $rootScope.seo = info.seo;

                                                  return info;
                                             });
                        }
              }
            });


            $routeProvider.when('/curso/:type/:nome', {
              templateUrl : '/views/info.html',
              controller : 'infoController as vm',
              resolve : {
                    Info : function ($rootScope, QiSatAPI, $route){
                              return QiSatAPI.getInfo ('curso/'+$route.current.params.type+"/"+$route.current.params.nome)
                                             .then(function (info){
                                                   if(info)
                                                      $rootScope.seo = info.seo;

                                                  return info;
                                             });
                        }
              }
            });

            $routeProvider.when('/certificacao/:nome', {
              templateUrl : '/views/info.html',
              controller : 'infoController as vm',
              resolve : {
                    Info : function ($rootScope, QiSatAPI, $route){
                              return QiSatAPI.getInfo ('certificacao/'+$route.current.params.nome)
                                             .then(function (info){
                                                   if(info)
                                                      $rootScope.seo = info.seo;

                                                  return info;
                                             });
                        }
              }
            });

            $routeProvider.when('/cursos/:type?/:cat?', {
              templateUrl : '/views/courses.html',
              controller : 'CoursesController as vm',
              resolve : {
                        
                        DataCoursesStates : function ( QiSatAPI ){
                                              return QiSatAPI.getCourseStates()
                                                             .then( function ( result ){
                                                                    return result;                                            
                                                              });
                                             }, 

                        DataCoursesFilter : function ( QiSatAPI ){
                                                return QiSatAPI.getFilterData()
                                                               .then( function ( result ){
                                                                        return result;
                                                                    });
                                                  }
              }
            });

            $routeProvider.when('/certificacoes', {
              templateUrl : '/views/courses.html',
              controller : 'CoursesController as vm',
              resolve : {
                        
                        DataCoursesStates : function ( QiSatAPI ){
                                              return QiSatAPI.getCourseStates()
                                                             .then( function ( result ){
                                                                    return result;                                            
                                                              });
                                             }, 

                        DataCoursesFilter : function ( QiSatAPI ){
                                                return QiSatAPI.getFilterData()
                                                               .then( function ( result ){
                                                                        return result;
                                                                    });
                                                  }
              },
              seo : {
                        title : 'Certificações AltoQi - QiSat | Cursos aplicados à engenharia e arquitetura',
                        robots : 'follow, index',
                        description : 'Um serviço de preparação progressiva, para você alcançar maior performance com a metade do esforço.',
                        keys : 'qisat, qi sat, certificação, proficiência, certificação software engenharia, certificação eberick, eberick, curso eberick, certificao para engenharia',
                        url : 'https://www.qisat.com.br/certificacoes'
                      }
            });

            $routeProvider.when('/cadastro', {
              templateUrl : '/views/cadastro.html',
              controller : 'singupController',
              isAuth : false,
              seo : {
                        title : 'Cadastre-se - QiSat | Cursos aplicados à engenharia e arquitetura',
                        robots : 'follow, index',
                        description : 'Na Área do Aluno QiSat você terá acesso as inscrições efetuadas, biblioteca, fórum, certificados e tira dúvidas. Solicite lembrete de senha ou cadastre-se.',
                        keys : 'qisat, qi sat, curso online qisat, cursos qisat, cursos altoqi, biblioteca, fórum, certificados, tira dúvidas, lembrete de senha qisat, cadastro qisat',
                        url : 'https://www.qisat.com.br/cadastro'
                      }
            });

            $routeProvider.when('/lembrete-de-senha', {
              templateUrl : '/views/lembrete-de-senha.html',
              controller : 'rememberController',
              isAuth : false,
              seo : {
                        title : 'Lembrete de Senha - QiSat | Cursos aplicados à engenharia e arquitetura',
                        robots : 'follow, index',
                        description : 'Na Área do Aluno QiSat você terá acesso as inscrições efetuadas, biblioteca, fórum, certificados e tira dúvidas. Solicite lembrete de senha ou cadastre-se.',
                        keys : 'qisat, qi sat, curso online qisat, cursos qisat, cursos altoqi, biblioteca, fórum, certificados, tira dúvidas, lembrete de senha qisat, cadastro qisat',
                        url : 'https://www.qisat.com.br/lembrete-de-senha'
                      }
            });

            $routeProvider.when('/login', {
              templateUrl : '/views/login.html',
              controller: 'loginController',
              isAuth : false,
              seo : {
                        title : 'Acesso ao Portal do Aluno - QiSat | Cursos aplicados à engenharia e arquitetura',
                        robots : 'follow, index',
                        description : 'Na Área do Aluno QiSat você terá acesso as inscrições efetuadas, biblioteca, fórum, certificados e tira dúvidas. Solicite lembrete de senha ou cadastre-se.',
                        keys : 'qisat, qi sat, curso online qisat, cursos qisat, cursos altoqi, biblioteca, fórum, certificados, tira dúvidas, lembrete de senha qisat, cadastro qisat',
                        url : 'https://www.qisat.com.br/login'
                      }
            });

            $routeProvider.when('/aluno', {
              templateUrl : '/views/aluno-cursos.html', 
              isAuth : true,
              controller: 'matriculaController',
              resolve : {
                Authenticated : function(authService, $location){
                      return authService.Authenticated('/login');
                  }
              },
              seo : {
                        title : 'Portal do Aluno - QiSat | Cursos aplicados à engenharia e arquitetura',
                        robots : 'follow, index',
                        description : 'Na Área do Aluno QiSat você terá acesso as inscrições efetuadas, biblioteca, fórum, certificados e tira dúvidas. Solicite lembrete de senha ou cadastre-se.',
                        keys : 'qisat, qi sat, curso online qisat, cursos qisat, cursos altoqi, biblioteca, fórum, certificados, tira dúvidas, lembrete de senha qisat, cadastro qisat',
                        url : 'https://www.qisat.com.br/aluno'
                      }
            });

            $routeProvider.when('/aluno/perfil', {
              templateUrl : '/views/aluno-perfil.html', 
              isAuth : true,
              controller: 'perfilController',
              resolve : {
                 Authenticated : function(authService, $location){
                      return authService.Authenticated('/login');
                  }
              },
              seo : {
                        title : 'Editar Perfil - QiSat | Cursos aplicados à engenharia e arquitetura',
                        robots : 'nofollow, noindex',
                        description : 'Na Área do Aluno QiSat você terá acesso as inscrições efetuadas, biblioteca, fórum, certificados e tira dúvidas. Solicite lembrete de senha ou cadastre-se.',
                        keys : 'qisat, qi sat, curso online qisat, cursos qisat, cursos altoqi, biblioteca, fórum, certificados, tira dúvidas, lembrete de senha qisat, cadastro qisat',
                        url : 'https://www.qisat.com.br/aluno/perfil'
                      }
            });

            $routeProvider.when('/aluno/certificados', {
              templateUrl : '/views/aluno-certificados.html', 
              isAuth : true,
              controller: 'certificadoController',
              resolve : {
                 Authenticated : function(authService, $location){
                      return authService.Authenticated('/login');
                  }
              },
              seo : {
                        title : 'Meus Certificados - QiSat | Cursos aplicados à engenharia e arquitetura',
                        robots : 'nofollow, noindex',
                        description : 'Na Área do Aluno QiSat você terá acesso as inscrições efetuadas, biblioteca, fórum, certificados e tira dúvidas. Solicite lembrete de senha ou cadastre-se.',
                        keys : 'qisat, qi sat, curso online qisat, cursos qisat, cursos altoqi, biblioteca, fórum, certificados, tira dúvidas, lembrete de senha qisat, cadastro qisat',
                        url : 'https://www.qisat.com.br/aluno/certificados'
                      }
            });

            $routeProvider.when('/aluno/cursos', {
              templateUrl : '/views/aluno-cursos.html', 
              isAuth : true,
              controller: 'matriculaController',
              resolve : {
                 Authenticated : function(authService, $location){
                      return authService.Authenticated('/login');
                  }
              },
              seo : {
                        title : 'Meus Cursos - QiSat | Cursos aplicados à engenharia e arquitetura',
                        robots : 'nofollow, noindex',
                        description : 'Na Área do Aluno QiSat você terá acesso as inscrições efetuadas, biblioteca, fórum, certificados e tira dúvidas. Solicite lembrete de senha ou cadastre-se.',
                        keys : 'qisat, qi sat, curso online qisat, cursos qisat, cursos altoqi, biblioteca, fórum, certificados, tira dúvidas, lembrete de senha qisat, cadastro qisat',
                        url : 'https://www.qisat.com.br/aluno/cursos'
                      }
            });

            $routeProvider.when('/aluno/financeiro', {
              templateUrl : '/views/aluno-financeiro.html',
              isAuth : true,
              controller: 'financeiroController',
              resolve : {
                 Authenticated : function(authService, $location){
                      return authService.Authenticated('/login');
                  }
              },
              seo : {
                        title : 'Minhas Compras - QiSat | Cursos aplicados à engenharia e arquitetura',
                        robots : 'nofollow, noindex',
                        description : 'Na Área do Aluno QiSat você terá acesso as inscrições efetuadas, biblioteca, fórum, certificados e tira dúvidas. Solicite lembrete de senha ou cadastre-se.',
                        keys : 'qisat, qi sat, curso online qisat, cursos qisat, cursos altoqi, biblioteca, fórum, certificados, tira dúvidas, lembrete de senha qisat, cadastro qisat',
                        url : 'https://www.qisat.com.br/aluno/financeiro'
                      }
            });

           $routeProvider.when('/aluno/carrinho/:id', {
              templateUrl : '/views/aluno-carrinho.html',
              isAuth : true,
              controller: 'alunoCarrinhoController',
              resolve : {
                 Authenticated : function(authService, $location){
                      return authService.Authenticated('/login');
                  }
              },
              seo : {
                        title : 'Detalhamento da Compra - QiSat | Cursos aplicados à engenharia e arquitetura',
                        robots : 'nofollow, noindex',
                        description : 'Na Área do Aluno QiSat você terá acesso as inscrições efetuadas, biblioteca, fórum, certificados e tira dúvidas. Solicite lembrete de senha ou cadastre-se.',
                        keys : 'qisat, qi sat, curso online qisat, cursos qisat, cursos altoqi, biblioteca, fórum, certificados, tira dúvidas, lembrete de senha qisat, cadastro qisat',
                        url : 'https://www.qisat.com.br/aluno/carrinho'
                      }
            });

           $locationProvider.html5Mode(true); 
           $locationProvider.hashPrefix('!');
           $routeProvider.otherwise('/');


    }]).run(function($rootScope, $window, $location, $route, $analytics, authService) {
          $rootScope.$on('$locationChangeSuccess', function (event, newUrl) {
              authService.load();
              $analytics.pageTrack($location.path());
              $window.ga('send', 'pageview', { page: $location.path() });

              if($route && $route.current && $route.current.$$route)
                $rootScope.seo = $route.current.$$route.seo;
          });
      });
})();