(function () {
  'use strict';

  angular
    .module('QiSatApp')
    .config(['$locationProvider', '$routeProvider', '__env',
      function ($locationProvider, $routeProvider, env) {

        aboutController.$inject = ['$scope', '$controller', 'QiSatAPI', 'authService'];
        function aboutController($scope, $controller, QiSatAPI, authService) {
          var modalController = $controller('modalController');
          var data = { empresa: "QiSat", origem: "Site QiSat", categoria: "Download Identidade" };

          $scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,6}$/;
          $scope.submitted = false;
          $scope.isDisabled = true;
          $scope.solicitarIdentidade = function () {
            var user = authService.getUser();

            $scope.submitted = true;
            if ($scope.email) {
              $scope.isDisabled = false;
              data.user_dados = { email: $scope.email };
              if (user)
                data.userid = user.id;
              QiSatAPI.newRepasse(data).then(function (res) {
                $scope.submitted = false;
                $scope.isDisabled = true;
                if (res && res.data && res.data.retorno && res.data.retorno.sucesso) {
                  delete ($scope.email);
                  $scope.visualForm.$setPristine();
                  modalController.alert({ success: true, main: { html: true, title: 'Download Realizado!', subtitle: '<p> Caso tenha problema, segue o link do arquivo </p> <a href="/files/Manual da Marca QiSat.pdf" download="Manual QiSat.pdf" title="Click para Iniciar o Donwload" target="_self" >Visualizar</a>' } });
                } else {
                  modalController.alert({ error: true, main: { html: true, subtitle: '<p> Caso tenha problema, segue o link do arquivo </p> <a href="/files/Manual da Marca QiSat.pdf" download="Manual QiSat.pdf" title="Click para Iniciar o Donwload" target="_self" >Visualizar</a>' } });
                }
              }, function (res) {
                $scope.submitted = false;
                $scope.isDisabled = true;
                modalController.alert({ error: true, main: { html: true, subtitle: '<p> Caso tenha problema, segue o link do arquivo </p> <a href="/files/Manual da Marca QiSat.pdf" download="Manual QiSat.pdf" title="Click para Iniciar o Donwload" target="_self" >Visualizar</a>' } });
              });
            }
          }
        }

        descontosConvenio.$inject = ['QiSatAPI'];
        function descontosConvenio(QiSatAPI) {
          return QiSatAPI.descontoConvenio().then(function (res) {
            if (res && res.sucesso) {
              var result = { cursosSoftware: [], cursosTeoricos: [] };
              angular.forEach(res.software, function (value) {
                result.cursosSoftware.push(value);
              });

              angular.forEach(res.teoricos, function (value) {
                result.cursosTeoricos.push(value);
              });

              return result;
            }
          });
        }

        institutions.$inject = ['QiSatAPI', '$filter'];
        function institutions(QiSatAPI, $filter) {
          return QiSatAPI.getConvenios()
            .then(function (response) {
              var data = [];
              if (response.status == 200)
                data = response.data.retorno.ecmConvenio;
              data.map(function (el) {
                el.dataFim = $filter('date')(el.timeend * 1000, 'dd/MM/yy');
              });
              return data;
            });
        }

        altoqilab.$inject = ['$window', '__env'];
        function altoqilab($window, env) {
          $window.location.href = env.url.altoqilab;
        }

        preducInscricao.$inject = ['$scope', '$controller', 'Config', 'QiSatAPI', 'institutions', 'vcRecaptchaService'];
        function preducInscricao($scope, $controller, Config, QiSatAPI, institutions, vcRecaptchaService) {

          var modalController = $controller('modalController');
          $scope.states = Config.states;
          $scope.selectInstitution = institutions;
          $scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,6}$/;
          $scope.submit = false;

          // Codigo Recaptcha
          $scope.responseRecaptcha = null;
          $scope.widgetId = null;
          $scope.setResponse = function (responseRecaptcha) {
            $scope.responseRecaptcha = responseRecaptcha;
          };
          $scope.setWidgetId = function (widgetId) {
            $scope.widgetId = widgetId;
          };
          $scope.reloadRecaptcha = function () {
            vcRecaptchaService.reload($scope.widgetId);
            $scope.responseRecaptcha = null;
          };

          $scope.institutionDiscount = function () {
            var data = angular.copy($scope.desconto);
            $scope.submit = true;

            if ($scope.descontoForm && $scope.descontoForm.$valid) {
              data.ecm_convenio_id = data.institution.id;
              delete (data.institution);
              data.recaptcha = $scope.gRecaptchaResponse;

              QiSatAPI.addInteresse(data)
                .then(function (response) {
                  if (response.data.retorno.sucesso) {
                    $scope.submit = false;
                    $scope.desconto = {};
                    $scope.descontoForm.$setPristine();
                    $scope.reloadRecaptcha();
                    modalController.alert({ success: true, main: { title: "Obrigado, por solicitar o Interesse!", subtitle: " Em breve entraremos em contato." } });
                  } else
                    modalController.alert({ error: true, main: { title: "Falha na Solicitação!" } });

                }, function (response) {
                  modalController.alert({ error: true });
                });
            } else
              modalController.alert({ error: true, main: { title: "Verifique os dados Solicitados!" } });
          };
        }

        $routeProvider.when('/', {
          templateUrl: '/views/index.html',
          data: {
            meta: {
              title: env.metatag.title,
              description: env.metatag.description,
              keys: env.metatag.keywords,
              robots: 'follow,index',
              url: 'https://www.qisat.com.br'
            }
          }
        })
          .when('/termos-de-uso', {
            templateUrl: '/views/modal-termo-de-uso.html',
            data: {
              meta: {
                title: 'Termos de Uso e Condições de Navegação - QiSat | Cursos aplicados à engenharia e arquitetura',
                robots: 'nofollow,noindex',
                description: 'A empresa apresenta aqui os Termos de Uso e Condições de Navegação de seu Portal, que deve ser respeitado pelos seus visitantes e usuários, sob pena de todas as implicações da legislação em vigor.',
                keys: env.metatag.keywords,
                url: 'https://www.qisat.com.br/termos-de-uso'
              }
            }
          })
          .when('/politica-de-privacidade', {
            templateUrl: '/views/modal-politica.html',
            data: {
              meta: {
                title: 'Política de Privacidade - QiSat | Cursos aplicados à engenharia e arquitetura',
                robots: 'nofollow,noindex',
                description: 'Como parte integrante dos Termos de Uso e Condições de Navegação do Portal da empresa, este documento denominado POLÍTICA DE PRIVACIDADE DA QISAT, tem por finalidade estabelecer as regras sobre obtenção, uso e armazenamento dos dados e informações coletadas dos visitantes e usuários, além do registro de suas atividades.',
                keys: env.metatag.keywords,
                url: 'https://www.qisat.com.br/politica-de-privacidade'
              }
            }
          })
          .when('/institucional', {
            templateUrl: '/views/institucional-sobre-a-empresa.html',
            controller: aboutController,
            data: {
              meta: {
                title: 'Sobre a Empresa - QiSat | Cursos aplicados à engenharia e arquitetura',
                robots: 'nofollow,noindex',
                description: 'O QiSat desenvolve e comercializa cursos online e presencial aplicados à engenharia e arquitetura. São 20 anos no mercado + de 60 cursos + de 51 mil matrículas.',
                keys: env.metatag.keywords,
                url: 'https://www.qisat.com.br/institucional/sobre-a-empresa'
              }
            }
          })
          .when('/institucional/sobre-a-empresa', {
            templateUrl: '/views/institucional-sobre-a-empresa.html',
            controller: aboutController,
            data: {
              meta: {
                title: 'Sobre a Empresa - QiSat | Cursos aplicados à engenharia e arquitetura',
                robots: 'follow,index',
                description: 'O QiSat desenvolve e comercializa cursos online e presencial aplicados à engenharia e arquitetura. São 20 anos no mercado + de 60 cursos + de 51 mil matrículas.',
                keys: env.metatag.keywords,
                url: 'https://www.qisat.com.br/institucional/sobre-a-empresa'
              }
            }
          })
          .when('/institucional/linha-do-tempo', {
            templateUrl: '/views/institucional-linha-do-tempo.html',
            data: {
              meta: {
                title: 'Linha do Tempo - QiSat | Cursos aplicados à engenharia e arquitetura',
                robots: 'follow,index',
                description: 'O QiSat atua na área da educação criando soluções inovadoras por meio de cursos online e presenciais promovendo capacitação continuada para engenheiros e arquitetos.',
                keys: env.metatag.keywords,
                url: 'https://www.qisat.com.br/institucional/linha-do-tempo'
              }
            }
          }).when('/institucional/convenios-e-parceiros', {
            templateUrl: '/views/institucional-parceiros.html',
            data: {
              meta: {
                title: 'Convênios e Parceiros - QiSat | Cursos aplicados à engenharia e arquitetura',
                robots: 'follow,index',
                description: 'O QiSat oferece benefícios para associados a Conselhos Regionais, Entidades de Classe e Universidades. Conheça os convênios. Solicite o convênio.',
                keys: 'qisat, qi sat, curso eberick, altoqi, eberick, treinamento AltoQi, cursos AltoQi, benefícios para associados, Conselhos Regionais, Entidades de Classe, Universidades, CREA, CREARO, CREADF, CREABA, CREATO, CREASC, CREAMS, CREA-RO, CREA-DF, CREA-BA, CREA-TO, CREA-SC, CREA-MS, CREA RO, CREA DF, CREA BA, CREA TO, CREA SC, CREA MS',
                url: 'https://www.qisat.com.br/institucional/convenios-e-parceiros'
              }
            }
          }).when('/institucional/parceiros', {
            templateUrl: '/views/institucional-parceiros.html',
            data: {
              meta: {
                title: 'Parceiros - QiSat | Cursos aplicados à engenharia e arquitetura',
                robots: 'follow,index',
                description: 'O QiSat oferece benefícios para associados a Conselhos Regionais, Entidades de Classe e Universidades. Conheça os convênios. Solicite o convênio.',
                keys: 'qisat, qi sat, curso eberick, altoqi, eberick, treinamento AltoQi, cursos AltoQi, benefícios para associados, Conselhos Regionais, Entidades de Classe, Universidades, CREA, CREARO, CREADF, CREABA, CREATO, CREASC, CREAMS, CREA-RO, CREA-DF, CREA-BA, CREA-TO, CREA-SC, CREA-MS, CREA RO, CREA DF, CREA BA, CREA TO, CREA SC, CREA MS',
                url: 'https://www.qisat.com.br/institucional/parceiros'
              }
            }
          }).when('/institucional/convenios/conselhos', {
            templateUrl: '/views/institucional-conselhos-cadastro.html',
            controller: 'convenioController as vm',
            data: {
              meta: {
                title: 'Conselhos Regionais - QiSat | Cursos aplicados à engenharia e arquitetura',
                robots: 'follow,index',
                description: 'O QiSat oferece benefícios para associados a Conselhos Regionais, Entidades de Classe e Universidades. Conheça os convênios. Solicite o convênio.',
                keys: 'qisat, qi sat, curso eberick, altoqi, eberick, treinamento AltoQi, cursos AltoQi, benefícios para associados, Conselhos Regionais, Entidades de Classe, Universidades, CREA, CREARO, CREADF, CREABA, CREATO, CREASC, CREAMS, CREA-RO, CREA-DF, CREA-BA, CREA-TO, CREA-SC, CREA-MS, CREA RO, CREA DF, CREA BA, CREA TO, CREA SC, CREA MS',
                url: 'https://www.qisat.com.br/institucional/convenios/conselhos'
              }
            }
          }).when('/institucional/convenios/conselhos/conveniados', {
            templateUrl: '/views/institucional-conselhos-conveniados.html',
            data: {
              meta: {
                title: 'Conselhos Regionais Conveniados - QiSat | Cursos aplicados à engenharia e arquitetura',
                robots: 'follow,index',
                description: 'O QiSat oferece benefícios para associados a Conselhos Regionais, Entidades de Classe e Universidades. Conheça os convênios. Solicite o convênio.',
                keys: 'qisat, qi sat, curso eberick, altoqi, eberick, treinamento AltoQi, cursos AltoQi, benefícios para associados, Conselhos Regionais, Entidades de Classe, Universidades, CREA, CREARO, CREADF, CREABA, CREATO, CREASC, CREAMS, CREA-RO, CREA-DF, CREA-BA, CREA-TO, CREA-SC, CREA-MS, CREA RO, CREA DF, CREA BA, CREA TO, CREA SC, CREA MS',
                url: 'https://www.qisat.com.br/institucional/convenios/conselhos/conveniados'
              }
            }
          }).when('/institucional/convenios/preduc/ensino', {
            templateUrl: '/views/institucional-preduc-ensino.html',
            controller: 'convenioController as vm',
            data: {
              meta: {
                title: 'Institucições de Ensino - QiSat | Cursos aplicados à engenharia e arquitetura',
                robots: 'follow,index',
                description: 'O QiSat oferece benefícios para associados a Conselhos Regionais, Entidades de Classe e Universidades. Conheça os convênios. Solicite o convênio.',
                keys: 'qisat, qi sat, curso eberick, altoqi, eberick, treinamento AltoQi, cursos AltoQi, benefícios para associados, Conselhos Regionais, Entidades de Classe, Universidades, CREA, CREARO, CREADF, CREABA, CREATO, CREASC, CREAMS, CREA-RO, CREA-DF, CREA-BA, CREA-TO, CREA-SC, CREA-MS, CREA RO, CREA DF, CREA BA, CREA TO, CREA SC, CREA MS',
                url: 'https://www.qisat.com.br/institucional/convenios/preduc/ensino'
              }
            }
          }).when('/institucional/convenios/preduc/entidade', {
            templateUrl: '/views/institucional-preduc-entidade.html',
            controller: 'convenioController as vm',
            data: {
              meta: {
                title: 'Entidades de Classe - QiSat | Cursos aplicados à engenharia e arquitetura',
                robots: 'follow,index',
                description: 'O QiSat oferece benefícios para associados a Conselhos Regionais, Entidades de Classe e Universidades. Conheça os convênios. Solicite o convênio.',
                keys: 'qisat, qi sat, curso eberick, altoqi, eberick, treinamento AltoQi, cursos AltoQi, benefícios para associados, Conselhos Regionais, Entidades de Classe, Universidades, CREA, CREARO, CREADF, CREABA, CREATO, CREASC, CREAMS, CREA-RO, CREA-DF, CREA-BA, CREA-TO, CREA-SC, CREA-MS, CREA RO, CREA DF, CREA BA, CREA TO, CREA SC, CREA MS',
                url: 'https://www.qisat.com.br/institucional/convenios/preduc/entidade'
              }
            }
          }).when('/institucional/convenios/preduc/conveniadas', {
            templateUrl: '/views/institucional-preduc-conveniadas.html',
            controller: ['$scope', 'Config', 'institutions', function ($scope, Config, institutions) {
              $scope.states = Config.states;
              $scope.institutions = institutions;
            }],
            resolve: {
              institutions: institutions,

              data: ['ngMeta', function (ngMeta) {
                ngMeta.setTitle('Entidades de Classe e Universidades Conveniadas - QiSat | Cursos aplicados à engenharia e arquitetura');
                ngMeta.setTag('robots', 'follow,index');
                ngMeta.setTag('description', 'O QiSat oferece benefícios para associados a Conselhos Regionais, Entidades de Classe e Universidades. Conheça os convênios. Solicite o convênio.');
                ngMeta.setTag('keys', 'qisat, qi sat, curso eberick, altoqi, eberick, treinamento AltoQi, cursos AltoQi, benefícios para associados, Conselhos Regionais, Entidades de Classe, Universidades, CREA, CREARO, CREADF, CREABA, CREATO, CREASC, CREAMS, CREA-RO, CREA-DF, CREA-BA, CREA-TO, CREA-SC, CREA-MS, CREA RO, CREA DF, CREA BA, CREA TO, CREA SC, CREA MS');
                ngMeta.setTag('url', 'https://www.qisat.com.br/institucional/convenios/preduc/conveniadas');
              }]
            }
          }).when('/institucional/convenios/preduc/inscricao', {
            templateUrl: '/views/institucional-preduc-inscricao.html',
            controller: preducInscricao,
            resolve: {
              institutions: institutions,

              data: ['ngMeta', function (ngMeta) {
                ngMeta.setTitle('Solicitar Desconto PREDUC - QiSat | Cursos aplicados à engenharia e arquitetura');
                ngMeta.setTag('robots', 'follow,index');
                ngMeta.setTag('description', 'O QiSat oferece benefícios para associados a Conselhos Regionais, Entidades de Classe e Universidades. Conheça os convênios. Solicite o convênio.');
                ngMeta.setTag('keys', 'qisat, qi sat, curso eberick, altoqi, eberick, treinamento AltoQi, cursos AltoQi, benefícios para associados, Conselhos Regionais, Entidades de Classe, Universidades, CREA, CREARO, CREADF, CREABA, CREATO, CREASC, CREAMS, CREA-RO, CREA-DF, CREA-BA, CREA-TO, CREA-SC, CREA-MS, CREA RO, CREA DF, CREA BA, CREA TO, CREA SC, CREA MS');
                ngMeta.setTag('url', 'https://www.qisat.com.br/institucional/convenios/preduc/inscricao');
              }]
            }
          }).when('/institucional/instrutores-e-professores', {
            templateUrl: '/views/institucional-instrutores.html',
            controller: 'instructorsController',
            resolve: {
              instrutores: ['QiSatAPI', function (QiSatAPI) {
                return QiSatAPI.getInstructors()
                  .then(function (res) {
                    if (res.status == 200 && res.data.retorno)
                      return res.data.retorno;
                  });
              }],

              data: ['ngMeta', function (ngMeta) {
                ngMeta.setTitle('Instrutores e Professores - QiSat | Cursos aplicados à engenharia e arquitetura');
                ngMeta.setTag('robots', 'follow,index');
                ngMeta.setTag('description', 'Conheça os instrutores e professores QiSat. Filtre por nome ou área de atuação. Conheça os cursos aplicados à engenharia e arquitetura. Entre em contato.');
                ngMeta.setTag('keys', 'instrutor eberick, professor eberick, rodrigo koerich,  rodrigo koerich eberick, enio padilha, stephane vannier, francisco qieletrico, julian silva');
                ngMeta.setTag('url', 'https://www.qisat.com.br/institucional/instrutores-e-professores');
              }]
            }
          }).when('/institucional/instrutor/:id', {
            templateUrl: '/views/institucional-instrutor.html',
            controller: 'instructorController',
            resolve: {
              instrutor: ['QiSatAPI', '$route', function (QiSatAPI, $route) {
                return QiSatAPI.getInstructor($route.current.params.id)
                  .then(function (res) {
                    if (res.status == 200 && res.data.retorno)
                      return res.data.retorno;
                  });
              }],

              data: ['ngMeta', function (ngMeta) {
                ngMeta.setTitle('Página do Instrutor - QiSat | Cursos aplicados à engenharia e arquitetura');
                ngMeta.setTag('robots', 'nofollow,noindex');
                ngMeta.setTag('description', 'Conheça os instrutores e professores QiSat. Filtre por nome ou área de atuação. Conheça os cursos aplicados à engenharia e arquitetura.');
                ngMeta.setTag('keys', 'instrutor eberick, professor eberick, rodrigo koerich,  rodrigo koerich eberick, enio padilha, stephane vannier, francisco qieletrico, julian silva');
                ngMeta.setTag('url', 'https://www.qisat.com.br/institucional/instrutor');
              }]
            }
          }).when('/institucional/contatos', {
            templateUrl: '/views/institucional-contatos.html',
            controller: 'contactController',
            data: {
              meta: {
                title: 'Entre em Contato - QiSat | Cursos aplicados à engenharia e arquitetura',
                robots: 'follow, index',
                description: 'Solicite contato por um dos canais de atendimento QiSat. Envie suas dúvidas sobre os cursos,  críticas, sugestões ou solicite auxílio para efetuar sua inscrição.',
                keys: 'qisat, contato qisat, qi sat, telefone qisat, chat qisat, numero qisat, orçamento qisat, suporte qisat, inscrição curso eberick, preço curso eberick, cursos altoqi, atendimento qisat, endereço qisat, ligamos pra você qisat',
                url: 'https://www.qisat.com.br/institucional/contatos'
              }
            }
          }).when('/carrinho', {
            templateUrl: '/views/carrinho-montar.html',
            controller: 'montarCarrinhoController as vm',
            data: {
              meta: {
                title: 'Carrinho de Compras - QiSat | Cursos aplicados à engenharia e arquitetura',
                robots: 'nofollow, noindex',
                description: 'Seja bem vindo ao carrinho de compras da QiSat. Acesse e aproveite! Aqui você encontra os mais variados cursos online e presenciais para engenharia e arquitetura.',
                keys: 'qisat, curso eberick, curso eberick preço, preço eberick, curso online eberick, curso de projeto, curso alvenaria estrutural, curso incendio, curso projeto eletrico',
                url: 'https://www.qisat.com.br/carrinho'
              }
            }
          }).when('/carrinho/add/:produto', {
            templateUrl: '/views/carrinho-montar.html',
            controller: 'montarCarrinhoController as vm',
            data: {
              meta: {
                title: 'Carrinho de Compras - QiSat | Cursos aplicados à engenharia e arquitetura',
                robots: 'nofollow, noindex',
                description: 'Seja bem vindo ao carrinho de compras da QiSat. Acesse e aproveite! Aqui você encontra os mais variados cursos online e presenciais para engenharia e arquitetura.',
                keys: 'qisat, curso eberick, curso eberick preço, preço eberick, curso online eberick, curso de projeto, curso alvenaria estrutural, curso incendio, curso projeto eletrico',
                url: 'https://www.qisat.com.br/carrinho'
              }
            }
          }).when('/carrinho/pagamento', {
            templateUrl: '/views/carrinho-pagamento.html',
            controller: 'pagamentoController as vm',
            resolve: {
              Authenticated: ['authService', function (authService) {
                return authService.Authenticated('/carrinho');
              }],
              formasPagamentos: ['carrinhoServive', '$location', function (carrinhoServive, $location) {
                return carrinhoServive.getCarrinho().then(function () {

                  if (carrinhoServive.hasTrilha() == false) {
                    return carrinhoServive.getFormas()
                      .then(function (formas) {
                        return formas;
                      });
                  } else
                    $location.path('/carrinho');
                });
              }],

              data: ['ngMeta', function (ngMeta) {
                ngMeta.setTitle('Carrinho de Compras - QiSat | Cursos aplicados à engenharia e arquitetura');
                ngMeta.setTag('robots', 'nofollow, noindex');
                ngMeta.setTag('description', 'Seja bem vindo ao carrinho de compras da QiSat. Acesse e aproveite! Aqui você encontra os mais variados cursos online e presenciais para engenharia e arquitetura.');
                ngMeta.setTag('keys', 'qisat, curso eberick, curso eberick preço, preço eberick, curso online eberick, curso de projeto, curso alvenaria estrutural, curso incendio, curso projeto eletrico');
                ngMeta.setTag('url', 'https://www.qisat.com.br/carrinho');
              }]

            }
          }).when('/proposta/:id', {
            templateUrl: '/views/carrinho-montar.html',
            controller: 'montarCarrinhoController as vm',
            resolve: {
              carrinho: ['carrinhoServive', '$route', '$controller', '$location',
                function (carrinhoServive, $route, $controller, $location) {
                  var modalController = $controller('modalController');
                  if (!isNaN($route.current.params.id))
                    return carrinhoServive.getProposta($route.current.params.id)
                      .then(function (res) {
                        if (res.sucesso)
                          return res.carrinho;
                        else if (res.mensagem) {
                          modalController.alert({ main: { title: res.mensagem }, error: true });
                          $location.path('/carrinho');
                        }
                      });
                }],

              data: ['ngMeta', function (ngMeta) {
                ngMeta.setTitle('Carrinho de Compras - QiSat | Cursos aplicados à engenharia e arquitetura');
                ngMeta.setTag('robots', 'nofollow, noindex');
                ngMeta.setTag('description', 'Seja bem vindo ao carrinho de compras da QiSat. Acesse e aproveite! Aqui você encontra os mais variados cursos online e presenciais para engenharia e arquitetura.');
                ngMeta.setTag('keys', 'qisat, curso eberick, curso eberick preço, preço eberick, curso online eberick, curso de projeto, curso alvenaria estrutural, curso incendio, curso projeto eletrico');
                ngMeta.setTag('url', 'https://www.qisat.com.br/carrinho');
              }]
            }
          }).when('/carrinho/confirmacao/:id', {
            templateUrl: '/views/carrinho-confirmacao.html',
            controller: 'confirmacaoController as vm',
            resolve: {
              Authenticated: ['authService', function (authService) {
                return authService.Authenticated('/carrinho');
              }],
              venda: ['carrinhoServive', '$route',
                function (carrinhoServive, $route) {
                  if (carrinhoServive.checkCarrinho())
                    return carrinhoServive.getVenda($route.current.params.id)
                      .then(function (res) {
                        if (res.sucesso)
                          return res.venda;
                      });
                  else
                    return false;
                }],

              data: ['ngMeta', function (ngMeta) {
                ngMeta.setTitle('Carrinho de Compras - QiSat | Cursos aplicados à engenharia e arquitetura');
                ngMeta.setTag('robots', 'nofollow, noindex');
                ngMeta.setTag('description', 'Seja bem vindo ao carrinho de compras da QiSat. Acesse e aproveite! Aqui você encontra os mais variados cursos online e presenciais para engenharia e arquitetura.');
                ngMeta.setTag('keys', 'qisat, curso eberick, curso eberick preço, preço eberick, curso online eberick, curso de projeto, curso alvenaria estrutural, curso incendio, curso projeto eletrico');
                ngMeta.setTag('url', 'https://www.qisat.com.br/carrinho');
              }]

            }
          }).when('/curso/online/:cat/:nome', {
            templateUrl: '/views/info.html',
            controller: 'infoController as vm',
            resolve: {
              Info: ['$rootScope', 'QiSatAPI', '$route',
                function ($rootScope, QiSatAPI, $route) {
                  return QiSatAPI.getInfo('curso/online/' + $route.current.params.cat + "/" + $route.current.params.nome)
                    .then(function (info) {
                      return info;
                    });
                }],

              data: ['ngMeta', function (ngMeta) {
                ngMeta.setTitle(env.metatag.title);
                ngMeta.setTag('robots', 'follow,index');
                ngMeta.setTag('description', env.metatag.description);
                ngMeta.setTag('keys', env.metatag.keywords);
                ngMeta.setTag('url', 'https://www.qisat.com.br');
              }]

            }
          }).when('/curso/:type/:nome', {
            templateUrl: '/views/info.html',
            controller: 'infoController as vm',
            resolve: {
              Info: ['$rootScope', 'QiSatAPI', '$route',
                function ($rootScope, QiSatAPI, $route) {
                  return QiSatAPI.getInfo('curso/' + $route.current.params.type + "/" + $route.current.params.nome)
                    .then(function (info) {
                      return info;
                    });
                }],

              data: ['ngMeta', function (ngMeta) {
                ngMeta.setTitle(env.metatag.title);
                ngMeta.setTag('robots', 'follow,index');
                ngMeta.setTag('description', env.metatag.description);
                ngMeta.setTag('keys', env.metatag.keywords);
                ngMeta.setTag('url', 'https://www.qisat.com.br');
              }]
            }
          }).when('/cursos/:type?/:cat?', {
            templateUrl: '/views/courses.html',
            controller: 'CoursesController as vm',
            resolve: {

              DataCoursesStates: ['QiSatAPI', function (QiSatAPI) {
                return QiSatAPI.getCourseStates()
                  .then(function (result) {
                    return result;
                  });
              }],

              DataCoursesFilter: ['QiSatAPI', function (QiSatAPI) {
                return QiSatAPI.getFilterData()
                  .then(function (result) {
                    return result;
                  });
              }],
              data: ['ngMeta', function (ngMeta) {
                ngMeta.setTitle(env.metatag.title);
                ngMeta.setTag('robots', 'follow,index');
                ngMeta.setTag('description', env.metatag.description);
                ngMeta.setTag('keys', env.metatag.keywords);
                ngMeta.setTag('url', 'https://www.qisat.com.br/cursos');
              }]

            }
          }).when('/cadastro', {
            templateUrl: '/views/cadastro.html',
            controller: 'singupController',
            isAuth: false,
            data: {
              meta: {
                title: 'Cadastre-se - QiSat | Cursos aplicados à engenharia e arquitetura',
                robots: 'follow, index',
                description: 'Na Área do Aluno QiSat você terá acesso as inscrições efetuadas, biblioteca, fórum, certificados e tira dúvidas. Solicite lembrete de senha ou cadastre-se.',
                keys: 'qisat, qi sat, curso online qisat, cursos qisat, cursos altoqi, biblioteca, fórum, certificados, tira dúvidas, lembrete de senha qisat, cadastro qisat',
                url: 'https://www.qisat.com.br/cadastro'
              }
            }
          }).when('/lembrete-de-senha', {
            templateUrl: '/views/lembrete-de-senha.html',
            controller: 'rememberController',
            isAuth: false,
            data: {
              meta: {
                title: 'Lembrete de Senha - QiSat | Cursos aplicados à engenharia e arquitetura',
                robots: 'follow, index',
                description: 'Na Área do Aluno QiSat você terá acesso as inscrições efetuadas, biblioteca, fórum, certificados e tira dúvidas. Solicite lembrete de senha ou cadastre-se.',
                keys: 'qisat, qi sat, curso online qisat, cursos qisat, cursos altoqi, biblioteca, fórum, certificados, tira dúvidas, lembrete de senha qisat, cadastro qisat',
                url: 'https://www.qisat.com.br/lembrete-de-senha'
              }
            }
          }).when('/login', {
            templateUrl: '/views/login.html',
            controller: 'loginController',
            isAuth: false,
            resolve: {
              Authenticated: ['authService', '$location',
                function (authService, $location) {
                  authService.Authenticated().then(function (res) {
                    if (res === true) {
                      $location.path('/aluno');
                    }
                  });
                }],
              data: ['ngMeta', function (ngMeta) {
                ngMeta.setTitle('Acesso ao Portal do Aluno - QiSat | Cursos aplicados à engenharia e arquitetura');
                ngMeta.setTag('robots', 'follow, index');
                ngMeta.setTag('description', 'Na Área do Aluno QiSat você terá acesso as inscrições efetuadas, biblioteca, fórum, certificados e tira dúvidas. Solicite lembrete de senha ou cadastre-se.');
                ngMeta.setTag('keys', 'qisat, qi sat, curso online qisat, cursos qisat, cursos altoqi, biblioteca, fórum, certificados, tira dúvidas, lembrete de senha qisat, cadastro qisat');
                ngMeta.setTag('url', 'https://www.qisat.com.br/login');
              }]

            }
          }).when('/confirmar-cadastro/:token?', {
            templateUrl: '/views/confirmar-cadastro.html',
            controller: 'confirmarCadastroController',
            isAuth: false,
            data: {
              meta: {
                title: 'Acesso ao Portal do Aluno - QiSat | Cursos aplicados à engenharia e arquitetura',
                robots: 'follow, index',
                description: 'Na Área do Aluno QiSat você terá acesso as inscrições efetuadas, biblioteca, fórum, certificados e tira dúvidas. Solicite lembrete de senha ou cadastre-se.',
                keys: 'qisat, qi sat, curso online qisat, cursos qisat, cursos altoqi, biblioteca, fórum, certificados, tira dúvidas, lembrete de senha qisat, cadastro qisat',
                url: 'https://www.qisat.com.br/confirmar-cadastro'
              }
            }
          }).when('/aluno', {
            templateUrl: '/views/aluno-index.html',
            isAuth: true,
            resolve: {
              Authenticated: ['authService', function (authService) {
                return authService.Authenticated('/login');
              }],

              data: ['ngMeta', function (ngMeta) {
                ngMeta.setTitle('Portal do Aluno - QiSat | Cursos aplicados à engenharia e arquitetura');
                ngMeta.setTag('robots', 'follow, index');
                ngMeta.setTag('description', 'Na Área do Aluno QiSat você terá acesso as inscrições efetuadas, biblioteca, fórum, certificados e tira dúvidas. Solicite lembrete de senha ou cadastre-se.');
                ngMeta.setTag('keys', 'qisat, qi sat, curso online qisat, cursos qisat, cursos altoqi, biblioteca, fórum, certificados, tira dúvidas, lembrete de senha qisat, cadastro qisat');
                ngMeta.setTag('url', 'https://www.qisat.com.br/aluno');
              }]

            }
          }).when('/aluno/cursos', {
            templateUrl: '/views/aluno-cursos.html',
            isAuth: true,
            controller: 'matriculaController',
            resolve: {
              Authenticated: ['authService', function (authService) {
                return authService.Authenticated('/login');
              }],

              data: ['ngMeta', function (ngMeta) {
                ngMeta.setTitle('Portal do Aluno - QiSat | Cursos aplicados à engenharia e arquitetura');
                ngMeta.setTag('robots', 'follow, index');
                ngMeta.setTag('description', 'Na Área do Aluno QiSat você terá acesso as inscrições efetuadas, biblioteca, fórum, certificados e tira dúvidas. Solicite lembrete de senha ou cadastre-se.');
                ngMeta.setTag('keys', 'qisat, qi sat, curso online qisat, cursos qisat, cursos altoqi, biblioteca, fórum, certificados, tira dúvidas, lembrete de senha qisat, cadastro qisat');
                ngMeta.setTag('url', 'https://www.qisat.com.br/aluno');
              }]

            }
          }).when('/aluno/altoqi-lab', {
            templateUrl: '/views/altoqi-lab.html',
            isAuth: true,
            controller: 'alunoTrilhaController as vm',
            resolve: {
              Authenticated: ['authService', function (authService) {
                return authService.Authenticated('/login');
              }],

              data: ['ngMeta', function (ngMeta) {
                ngMeta.setTitle('Portal do Aluno - QiSat | Cursos aplicados à engenharia e arquitetura');
                ngMeta.setTag('robots', 'follow, index');
                ngMeta.setTag('description', 'Na Área do Aluno QiSat você terá acesso as inscrições efetuadas, biblioteca, fórum, certificados e tira dúvidas. Solicite lembrete de senha ou cadastre-se.');
                ngMeta.setTag('keys', 'qisat, qi sat, curso online qisat, cursos qisat, cursos altoqi, biblioteca, fórum, certificados, tira dúvidas, lembrete de senha qisat, cadastro qisat');
                ngMeta.setTag('url', 'https://www.qisat.com.br/aluno');
              }]
            }
          }).when('/aluno/perfil', {
            templateUrl: '/views/aluno-perfil.html',
            isAuth: true,
            controller: 'perfilController',
            resolve: {
              Authenticated: ['authService', function (authService) {
                return authService.Authenticated('/login');
              }],

              data: ['ngMeta', function (ngMeta) {
                ngMeta.setTitle('Editar Perfil - QiSat | Cursos aplicados à engenharia e arquitetura');
                ngMeta.setTag('robots', 'nofollow, noindex');
                ngMeta.setTag('description', 'Na Área do Aluno QiSat você terá acesso as inscrições efetuadas, biblioteca, fórum, certificados e tira dúvidas. Solicite lembrete de senha ou cadastre-se.');
                ngMeta.setTag('keys', 'qisat, qi sat, curso online qisat, cursos qisat, cursos altoqi, biblioteca, fórum, certificados, tira dúvidas, lembrete de senha qisat, cadastro qisat');
                ngMeta.setTag('url', 'https://www.qisat.com.br/aluno/perfil');
              }]
            }
          }).when('/aluno/certificados', {
            templateUrl: '/views/aluno-certificados.html',
            isAuth: true,
            controller: 'certificadoController',
            resolve: {
              Authenticated: ['authService', function (authService) {
                return authService.Authenticated('/login');
              }],

              data: ['ngMeta', function (ngMeta) {
                ngMeta.setTitle('Meus Certificados - QiSat | Cursos aplicados à engenharia e arquitetura');
                ngMeta.setTag('robots', 'nofollow, noindex');
                ngMeta.setTag('description', 'Na Área do Aluno QiSat você terá acesso as inscrições efetuadas, biblioteca, fórum, certificados e tira dúvidas. Solicite lembrete de senha ou cadastre-se.');
                ngMeta.setTag('keys', 'qisat, qi sat, curso online qisat, cursos qisat, cursos altoqi, biblioteca, fórum, certificados, tira dúvidas, lembrete de senha qisat, cadastro qisat');
                ngMeta.setTag('url', 'https://www.qisat.com.br/aluno/certificados');
              }]

            }
          }).when('/aluno/financeiro', {
            templateUrl: '/views/aluno-financeiro.html',
            isAuth: true,
            controller: 'financeiroController',
            resolve: {
              Authenticated: ['authService', function (authService) {
                return authService.Authenticated('/login');
              }],

              data: ['ngMeta', function (ngMeta) {
                ngMeta.setTitle('Minhas Compras - QiSat | Cursos aplicados à engenharia e arquitetura');
                ngMeta.setTag('robots', 'nofollow, noindex');
                ngMeta.setTag('description', 'Na Área do Aluno QiSat você terá acesso as inscrições efetuadas, biblioteca, fórum, certificados e tira dúvidas. Solicite lembrete de senha ou cadastre-se.');
                ngMeta.setTag('keys', 'qisat, qi sat, curso online qisat, cursos qisat, cursos altoqi, biblioteca, fórum, certificados, tira dúvidas, lembrete de senha qisat, cadastro qisat');
                ngMeta.setTag('url', 'https://www.qisat.com.br/aluno/financeiro');
              }]
            }
          }).when('/aluno/carrinho/:id', {
            templateUrl: '/views/aluno-carrinho.html',
            isAuth: true,
            controller: 'alunoCarrinhoController',
            resolve: {
              Authenticated: ['authService', function (authService) {
                return authService.Authenticated('/login');
              }],

              data: ['ngMeta', function (ngMeta) {
                ngMeta.setTitle('Detalhamento da Compra - QiSat | Cursos aplicados à engenharia e arquitetura');
                ngMeta.setTag('robots', 'nofollow, noindex');
                ngMeta.setTag('description', 'Na Área do Aluno QiSat você terá acesso as inscrições efetuadas, biblioteca, fórum, certificados e tira dúvidas. Solicite lembrete de senha ou cadastre-se.');
                ngMeta.setTag('keys', 'qisat, qi sat, curso online qisat, cursos qisat, cursos altoqi, biblioteca, fórum, certificados, tira dúvidas, lembrete de senha qisat, cadastro qisat');
                ngMeta.setTag('url', 'https://www.qisat.com.br/aluno/carrinho');
              }]
            }
          }).otherwise({
            redirectTo: '/'
          });

        if (env.environment != 'production') {

          $routeProvider.when('/altoqi-lab', {
            templateUrl: '/views/courses.html',
            controller: 'CoursesController as vm',
            resolve: {

              DataCoursesStates: ['QiSatAPI', function (QiSatAPI) {
                return QiSatAPI.getCourseStates()
                  .then(function (result) {
                    return result;
                  });
              }],
              DataCoursesFilter: ['QiSatAPI', function (QiSatAPI) {
                return QiSatAPI.getFilterData()
                  .then(function (result) {
                    return result;
                  });
              }],

              data: ['ngMeta', function (ngMeta) {
                ngMeta.setTitle('AltoQi LAB – Programa de capacitação profissional em projetos de edificações | QiSat ');
                ngMeta.setTag('robots', 'follow, index');
                ngMeta.setTag('description', 'Experiência e conhecimento técnico aplicado ao desenvolvimento de projetos naturalmente integrados, contando com assessoramento profissional e uso consciente das plataformas AltoQi.');
                ngMeta.setTag('keys', 'qisat, qi sat, altoqi-lab, proficiência, certificação software engenharia, certificação eberick, eberick, curso eberick, curso de projetos, projetos de edificações, experiência em projetos, conhecimento técnico em projetos, desenvolvimento de projetos, projetos integrados');
                ngMeta.setTag('url', 'https://www.qisat.com.br/altoqi-lab');
              }]
            }
          });

        } else {
          $routeProvider.when('/altoqi-lab', {
            templateUrl: '/views/courses.html',
            controller: altoqilab,
            data: {
              meta: {
                title: 'AltoQi LAB – Programa de capacitação profissional em projetos de edificações | QiSat ',
                robots: 'follow, index',
                description: 'Experiência e conhecimento técnico aplicado ao desenvolvimento de projetos naturalmente integrados, contando com assessoramento profissional e uso consciente das plataformas AltoQi.',
                keys: 'qisat, qi sat, altoqi-lab, proficiência, certificação software engenharia, certificação eberick, eberick, curso eberick, curso de projetos, projetos de edificações, experiência em projetos, conhecimento técnico em projetos, desenvolvimento de projetos, projetos integrados',
                url: 'https://www.qisat.com.br/altoqi-lab'
              }
            }
          });
        }

        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

      }]).run(['$rootScope', '$location', 'Config', '$analytics', 'ngMeta',
        function ($rootScope, $location, Config, $analytics, ngMeta) {
          ngMeta.init();

          $rootScope.$on('$locationChangeSuccess', function () {
            if (Config.environment == 'production') {
              $analytics.pageTrack($location.path());
            }
          });
        }]);
})();
