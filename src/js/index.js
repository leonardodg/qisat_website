window.moment = require('moment');
window.extenso = require('extenso');
window.humanizeDuration = require("humanize-duration");

require('npm-modernizr');
require("jquery");
require('foundation-sites');
require('angular');
require('angular-foundation');

require('owl.carousel');
require('jquery-placeholder');
require('slick-carousel');
require('sticky-kit/dist/sticky-kit');
require('simplelightbox');

require('moment/locale/pt-br');
require('moment-timezone');

// DEPENDENCIAS ANGULARJS
require('angular-locale-pt-br');
require('angular-ui-mask');
require('angular-resource');
require('angular-cookies');
require('angular-route');
require('angular-timer');
require('angulartics');
require('angulartics-google-analytics');
require('angulartics-facebook-pixel');
require('angulartics-google-tag-manager');
require('angular-loading-bar');
require('angular-sanitize');
require('angular-recaptcha');
require('angular-credit-cards');
require('ng-mask');
require('ng-meta');
require('angular-ui-mask');
require('ng-infinite-scroll');
require('angular-input-masks');

// ## BEGIN DEV QISAT ##
require('./QiSatApp.js');
require('./routes/all.js');
require('./config/value.js');
require('./config/analytics.js');
require('./config/interceptors.js');
require('./config/metatag.js');
require('./config/recaptcha.js');
require('./filters/filters.js');
require('./directive/anchorLink.js');
require('./directive/backImg.js');
require('./directive/backImgInstructor.js');
require('./directive/bnLazySrc.js');
require('./directive/cpfCheck.js');
require('./directive/emailCheck.js');
require('./directive/hrefPortal.js');
require('./directive/lightbox.js');
require('./directive/menuActive.js');
require('./directive/menuAlunoCursos.js');
require('./directive/menuCarrinhoActive.js');
require('./directive/owlSync.js');
require('./directive/playDemoModal.js');
require('./directive/pwCheck.js');
require('./directive/slick.js');
require('./directive/stickyKit.js');
require('./directive/pageBuy.js');
require('./directive/chaveAltoqi.js');
require('./directive/cupomDebounce.js');
require('./directive/tabMainLab.js');
require('./directive/tabSubMenuLab.js');
require('./directive/overDirectiveAccordionGroup.js');
require('./services/QiSatAPI.js');
require('./services/authService.js');
require('./services/carrinho.js');
require('./services/postmonService.js');
require('./controllers/TopCoursesController.js');
require('./controllers/alunoCarrinhoController.js');
require('./controllers/alunoController.js');
require('./controllers/carrinhoController.js');
require('./controllers/certificadoController.js');
require('./controllers/confirmacaoController.js');
require('./controllers/contactController.js');
require('./controllers/convenioController.js');
require('./controllers/coursesController.js');
require('./controllers/descontosConvenioController.js');
require('./controllers/financeiroController.js');
require('./controllers/infoController.js');
require('./controllers/institucionalController.js');
require('./controllers/instructorController.js');
require('./controllers/instructorsController.js');
require('./controllers/instructorsIndexController.js');
require('./controllers/loginController.js');
require('./controllers/confirmarCadastroController.js');
require('./controllers/matriculaController.js');
require('./controllers/modalController.js');
require('./controllers/montarCarrinhoController.js');
require('./controllers/pagamentoController.js');
require('./controllers/perfilController.js');
require('./controllers/rememberController.js');
require('./controllers/singupController.js');
require('./controllers/userController.js');
require('./controllers/trilhaController.js');
require('./controllers/alunoTrilhaController.js');
require('./run/foundation.js');
// ## END DEV QISAT ##

require('./customFontAwesome.js');

moment.locale('pt-BR');

$(window).on("load", function () {
    $(document).on('click', ".show-filters a", function (e) {
        e.preventDefault();

        var $elText = $(this).find("span");

        if ($elText.text() == "Mostrar filtros") {
            $elText.text('Esconder filtros');
        } else {
            $elText.text('Mostrar filtros');
        }

        $(".menu-filter-sidebars").toggleClass("show-for-small-up");
    });

    $(document).on('click', ".anchor", function (e) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top
            }, 1000);
        }
    });

    $(".map__state").click(function () {
        $(".mapa .map__state").removeClass("active");
        $(this).addClass("active");
    });

    $('body').on('click', '.page-certificates .card a', function (e) {
        e.preventDefault();
        $(this).closest('form').submit();
    });

    // TINHA DO TEMPO - INSTITUCIONAL
    $(document).on('click', ".timeline__list-group li", function (e) {
        var getRef = $(this).data("year");
        var target = $('[name=' + getRef + ']');
        var random = Math.floor(Math.random() * (70 - 50)) + 50;

        if (target.length) {
            e.preventDefault();

            $('.list-group-item.active').removeClass("active");
            $(this).addClass("active");

            $(".timeline__post.active").removeClass("active").hide();
            $(document).find(".timeline__post.year-" + getRef).fadeIn("fast", function () {
                $(this).addClass("active");
            });

            $('html, body').animate({
                scrollTop: target.offset().top - random
            }, 1000);

            return false;
        }
    });

    $('body').on('click', '.buttom-favorite', function (event) {
        event.preventDefault();
        $('.buttom-favorite').children('i').text('star');

        var bookmarkURL = window.location.href;
        var bookmarkTitle = document.title;

        if ('addToHomescreen' in window && window.addToHomescreen.isCompatible) {
            // Mobile browsers
            addToHomescreen({ autostart: false, startDelay: 0 }).show(true);
        } else if (window.sidebar && window.sidebar.addPanel) {
            // Firefox version < 23
            window.sidebar.addPanel(bookmarkTitle, bookmarkURL, '');
        } else if ((window.sidebar && /Firefox/i.test(navigator.userAgent)) || (window.opera && window.print)) {
            // Firefox version >= 23 and Opera Hotlist
            $('.buttom-favorite').attr({
                href: bookmarkURL,
                title: bookmarkTitle,
                rel: 'sidebar'
            });
            return true;
        } else if (window.external && ('AddFavorite' in window.external)) {
            // IE Favorite
            window.external.AddFavorite(bookmarkURL, bookmarkTitle);
        } else {
            // Other browsers (mainly WebKit - Chrome/Safari)
            console.log('Pease press ' + (/Mac/i.test(navigator.userAgent) ? 'CMD' : 'Strg') + ' + D to add this page to your favorites.');
        }

        return false;
    });

    // $('body').on('click', '.anchor-link', function(event){
    //   event.preventDefault();
    //   return false;
    // });

});

// $('.header-main__item-cart,  #cd-shadow-layer, .cd-go-to-cart').on('click', function(event){
//         event.preventDefault();
//        $("#cd-cart, #cd-shadow-layer, .header-main__list-cart").toggleClass("actived");
// });

//toggle foter
// if ( $('.footer-primary__list__item').length ) {
//       if ($(window).width() < 640) {

//           $(function() {
//             $(".footer-primary__list__item").hide(200);

//                  $('.footer-primary__list').children('.footer-primary__title').on('click', function(event){
//                     event.preventDefault();
//                     $(this).siblings(".footer-primary__list__item").slideToggle(200);
//                  });
//             }());
//       } else{
//          $(".footer-primary__list__item").show(200);
//       }
// }

///cards para transformar em card ou linha
$(function () {
    if ($('.toggle-form-type').length) {

        $('.toggle-form-type').on('click', function (event) {
            event.preventDefault();
            $(this).toggleClass('toggle-form-type--active');

            if ($('.card-course').hasClass('card-format-block')) {
                $(".card-course").removeClass("card-format-block").addClass("card-format-line");
                $(".card-course").addClass("card-format-line");
                $(".list-filter").removeClass("small-block-grid-1 medium-block-grid-3 large-block-grid-3").addClass("small-block-grid-1 medium-block-grid-1 large-block-grid-1");

            }
            else if ($('.card-course').hasClass('card-format-line')) {
                $(".card-course").removeClass("card-format-line").addClass("card-format-block");
                $(".card-course").addClass("card-format-block");
                $(".list-filter").removeClass("small-block-grid-1 medium-block-grid-1 large-block-grid-1").addClass("small-block-grid-1 medium-block-grid-3 large-block-grid-3");
            }
        });
    }
}());