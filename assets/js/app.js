
  // Foundation JavaScript
  // Documentation can be found at: http://foundation.zurb.com/docs
  $(document).foundation();

   // $("#menu").metisMenu({
   //   collapseInClass: 'in';
   // });

   $(document).ready(function() {

     $(".owl-carousel-testimonials-home").owlCarousel({
         navigation : false, // Show next and prev buttons
         slideSpeed : 300,
         paginationSpeed : 400,
         singleItem:true,
         autoHeight:true,

         //"singleItem:true" is a shortcut for:
          items : 1,
         itemsDesktop : false,
         itemsDesktopSmall : false,
         itemsTablet: false,
         itemsMobile : false
     });

   });


/* Temporário
   temporário, usado somente para testar, a ideia é que seja feito em php,
   se favorirar adicionar a class .buttom-favorite-active  */

     $(function() {
       if ( $('.buttom-favorite').length ) {
             $('.buttom-favorite').on('click', function(){
                   event.preventDefault();
                  // alert("foi")
                  $(this).toggleClass("buttom-favorite-active");
             });


             $('.form-button-call-me').on('click', function(){
                        event.preventDefault();
                       $(".section-call__form").css({"height": "0", "overflow": "hidden"});
                       $(".section-call__done").css({"height": "initial", "overflow": "initial"});
              });
        }
      }());
/* end página cursos > botão favoritar*/



//zurb foundation animate accordion
$(function() {
  if ( $('.accordion').length ) {
        // se accordion estiver presente, executa esse codigo
        $(".accordion").on("click", "dd", function () {
                if($(this).hasClass('active')){
                    $("dd.active").removeClass('active').find(".content").slideUp("fast");
                }
                else {
                    $("dd.active").removeClass('active').find(".content").slideUp("fast");
                    $(this).addClass('active').find(".content").slideToggle("fast");
                }
        });
  }
});
//end zurb foundation animate accordion




//toggle foter
if ( $('.footer-primary__list__item').length ) {
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
}



//Smooth Scrolling : https://css-tricks.com/snippets/jquery/smooth-scrolling/
 $(function() {
   if ( $('.navigation_courses__list-item--link').length ) {

        $('.navigation_courses__list-item--link').click(function() {
          if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') && location.hostname === this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
              $('html, body').animate({
                scrollTop: (target.offset().top)-80
              }, 1000);
              return false;
            }
          }
        });
    }
});
  //end Smooth Scrolling








///simple modal image
   $(function() {
     if ( $('.section__course-gallery-list--link').length ) {
         $('.section__course-gallery-list--link').on('click', function(event){
               event.preventDefault();
              // alert("foi")
              $(this).toggleClass("active");

         });
       }
     }());













  ///cards para transformar em card ou linha
     $(function() {
        if ( $('.toggle-form-type').length ) {

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
                  }

                  $('#container-isotope').isotope();

             });
        }
      }());
