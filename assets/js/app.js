// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
$(document).foundation();

 // $("#menu").metisMenu({
 //   collapseInClass: 'in';
 // });


/* Temporário
   temporário, usado somente para testar, a ideia é que seja feito em php,
   se favorirar adicionar a class .buttom-favorite-active  */
     $(function() {


       $('.buttom-favorite').on('click', function(event){
             event.preventDefault();
            // alert("foi")
            $(this).toggleClass("buttom-favorite-active");
       });


       $('.form-button-call-me').on('click', function(event){
                  event.preventDefault();

                 $(".section-call__form").css({"height": "0", "overflow": "hidden"});
                 $(".section-call__done").css({"height": "initial", "overflow": "initial"});
            });



      }());
/* end página cursos > botão favoritar*/



//zurb foundation animate accordion
$(".accordion").on("click", "dd", function (event) {
        if($(this).hasClass('active')){
            $("dd.active").removeClass('active').find(".content").slideUp("fast");
        }
        else {
            $("dd.active").removeClass('active').find(".content").slideUp("fast");
            $(this).addClass('active').find(".content").slideToggle("fast");
        }
});
//end zurb foundation animate accordion




//toggle foter

  if ($(window).width() < 640) {

      $(function() {
        $(".footer-primary__list__item").hide(200);

             $('.footer-primary__list').children('.footer-primary__title').on('click', function(event){
                event.preventDefault();
                $(this).siblings(".footer-primary__list__item").slideToggle(200);
             });
        }());
  } else{
     $(".footer-primary__list__item").show(200);
  }














///simple modal image
   $(function() {
     $('.section__course-gallery-list--link').on('click', function(event){
           event.preventDefault();
          // alert("foi")
          $(this).toggleClass("active");

     });
    }());




//Smooth Scrolling : https://css-tricks.com/snippets/jquery/smooth-scrolling/
/*
$(function() {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
});
*/
//end Smooth Scrolling




jQuery(document).ready(function($){
  var $lateral_menu_trigger = $('.menu-trigger'),
    $content_wrapper = $('.site-app');


  //open-close lateral menu clicking on the menu icon
  $lateral_menu_trigger.on('click', function(event){
    event.preventDefault();

    $lateral_menu_trigger.toggleClass('is-clicked');
    $content_wrapper.toggleClass('offcanvas-menu-is-open').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
      // firefox transitions break when parent overflow is changed, so we need to wait for the end of the trasition to give the body an overflow hidden
      $('body').toggleClass('overflow-hidden');
    });
    $('.offcanvas').toggleClass('offcanvas-menu-is-open');

    //check if transitions are not supported - i.e. in IE9
    if($('html').hasClass('no-csstransitions')) {
      $('body').toggleClass('overflow-hidden');
    }
  });

  //close lateral menu clicking outside the menu itself
  $content_wrapper.on('click', function(event){
    if( !$(event.target).is('.menu-trigger, .menu-trigger span') ) {
      $lateral_menu_trigger.removeClass('is-clicked');
    //  $navigation.removeClass('offcanvas-menu-is-open');
      $content_wrapper.removeClass('offcanvas-menu-is-open').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
        $('body').removeClass('overflow-hidden');
      });
      $('.offcanvas').removeClass('offcanvas-menu-is-open');
      //check if transitions are not supported
      if($('html').hasClass('no-csstransitions')) {
        $('body').removeClass('overflow-hidden');
      }

    }
  });
  //open (or close) submenu items in the lateral menu. Close all the other open submenu items.

//  $('.item-has-children').children('a').on('click', function(event){
//    event.preventDefault();
//    $(this).toggleClass('submenu-open').next('.sub-menu').slideToggle(200).end().parent('.item-has-children').siblings('.item-has-children').children('a').removeClass('submenu-open').next('.sub-menu').slideUp(200);
//  });






 // $(function() {
 //      $('.owl-carousel-instructors-home').owlCarousel({
 //          loop:true,
 //          margin:10,
 //          nav:false,
 //          center: true,
 //          responsive:{
 //              0:{
 //                  items:1
 //              },
 //              600:{
 //                  items:3
 //              },
 //              1100:{
 //                  items:5
 //              }
 //          }
 //      });

 //  }());




  ///cards para transformar em card ou linha
     $(function() {
       $('.toggle-form-type').on('click', function(event){
             event.preventDefault();
             $(this).toggleClass('toggle-form-type--active');
 
            if($('.card-course').hasClass('card-format-block')) {
              $(".card-course").removeClass("card-format-block").addClass("card-format-line");
              $(".card-course").addClass("card-format-line");
              $(".filtered-list").removeClass("small-block-grid-1 medium-block-grid-2 large-block-grid-3").addClass("small-block-grid-1 medium-block-grid-1 large-block-grid-1");
              $(".isotope_content-item").addClass("isotope_content-item--list");

             }
            else if($('.card-course').hasClass('card-format-line')) {
              $(".card-course").removeClass("card-format-line").addClass("card-format-block");
              $(".card-course").addClass("card-format-block");
              $(".filtered-list").removeClass("small-block-grid-1 medium-block-grid-1 large-block-grid-1").addClass("small-block-grid-1 medium-block-grid-2 large-block-grid-3");
              $(".isotope_content-item").removeClass("isotope_content-item--list");
            };

            $('#container-isotope').isotope();

       });
      }());




});
