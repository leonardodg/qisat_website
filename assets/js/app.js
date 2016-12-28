
  // Foundation JavaScript
  // Documentation can be found at: http://foundation.zurb.com/docs
  $(document).foundation();
  // setTimeout(function(){
  //   $(document).foundation();
  //   console.log('this');
      
  // }, 500);

   // $("#menu").metisMenu({
   //   collapseInClass: 'in';
   // });



$(document).foundation('equalizer', 'reflow');


// -------------------- HABILITAR MENU MOBILE NÃO FUNCIONA ----------------------------
//  $(document).foundation(
//  {
// "magellan-expedition": {
//   active_class: 'navigation_courses__list-item-active', // specify the class used for active sections
//   threshold: 0, // how many pixels until the magellan bar sticks, 0 = auto
//   destination_threshold: 20, // pixels from the top of destination for it to be considered active
//   throttle_delay: 50, // calculation throttling to increase framerate
//   fixed_top: 0, // top distance in pixels assigend to the fixed element on scroll
//   offset_by_height: true // whether to offset the destination by the expedition height. Usually you want this to be true, unless your expedition is on the side.
// }
// }
// );
// -------------------- HABILITAR MENU MOBILE NÃO FUNCIONA ----------------------------
 $(document).foundation(
 {
"magellan-expedition": {
  active_class: 'navigation_courses__list-item-active', // specify the class used for active sections
  threshold: 0, // how many pixels until the magellan bar sticks, 0 = auto
  destination_threshold: 20, // pixels from the top of destination for it to be considered active
  throttle_delay: 50, // calculation throttling to increase framerate
  fixed_top: 0, // top distance in pixels assigend to the fixed element on scroll
  offset_by_height: true // whether to offset the destination by the expedition height. Usually you want this to be true, unless your expedition is on the side.
}
}

);


$(function() {
  $('.show-filters a').click(function(e) {
    e.preventDefault();
    var $elText = $(this).find("span");

    if($elText.text() == "Mostrar filtros"){
      $elText.text('Esconder filtros');
    } else {
      $elText.text('Mostrar filtros');
    }

    $(".menu-filter-sidebars").toggleClass("show-for-small-up");
      
  });

  $('.anchor').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });

   $(".map__state").click(function() {
      $(".mapa .map__state").removeClass("active");
      $(this).addClass("active");
  });
   
});




 $('.header-main__item-cart,  #cd-shadow-layer, .cd-go-to-cart').on('click', function(event){
         event.preventDefault();
        $("#cd-cart, #cd-shadow-layer, .header-main__list-cart").toggleClass("actived");
 });




$(document).ready(function() {

  $(document).on('click', ".btn-password", function(e){
    console.log(e);
    e.preventDefault();
    $(".showPassword").slideToggle();
  });

  if ( $('#sidebar-styker').length ) {
       $("#sidebar-styker").stick_in_parent({
        offset_top: 80,
        recalc_every: 1,
       });
  }

   if ( $('#sidebar-styker--courses').length ) {
       $("#sidebar-styker--courses").stick_in_parent({
        offset_top: 200,
        recalc_every: 1,
       });
  }

}());


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




/* Temporário
   temporário, usado somente para testar,
   se clicar  .cd-item-remove  */

$(function() {
  if ( $('.cd-item-remove').length ) {
           $('.cd-item-remove').on('click', function(event){
                   //event.preventDefault();
                  $(this).parent().addClass("remove");
                    console.log("clicado");
          });
  }
});









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


///simple modal image
// $(function() {

//   setTimeout(function(){
//     if ( $('.lightbox').length ) {
//       $('.lightbox a').simpleLightbox();
//     }
//   }, 500);

//   if ( $('.section__course-gallery-list--link').length ) {
//     $('.section__course-gallery-list--link').on('click', function(event){
//       event.preventDefault();
//       $(this).toggleClass("active");
//     });
//   }

// });













  ///cards para transformar em card ou linha
     $(function() {
        if ( $('.toggle-form-type').length ) {

             $('.toggle-form-type').on('click', function(event){
                   event.preventDefault();
                   $(this).toggleClass('toggle-form-type--active');

                  if($('.card-course').hasClass('card-format-block')) {
                    $(".card-course").removeClass("card-format-block").addClass("card-format-line");
                    $(".card-course").addClass("card-format-line");
                    $(".list-filter").removeClass("small-block-grid-1 medium-block-grid-3 large-block-grid-3").addClass("small-block-grid-1 medium-block-grid-1 large-block-grid-1");
 
                   }
                  else if($('.card-course').hasClass('card-format-line')) {
                    $(".card-course").removeClass("card-format-line").addClass("card-format-block");
                    $(".card-course").addClass("card-format-block");
                    $(".list-filter").removeClass("small-block-grid-1 medium-block-grid-1 large-block-grid-1").addClass("small-block-grid-1 medium-block-grid-3 large-block-grid-3");
                   }

 
             });
        }
      }());



//Smooth Scrolling : https://css-tricks.com/snippets/jquery/smooth-scrolling/
$(document).ready(function() {
    
        $('body').on('click', '.navigation_courses__list-item--link', function(e){
          e.preventDefault();

            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');

            if (target.length) {
              $('html, body').animate({
                scrollTop: (target.offset().top)-80
              }, 1000);
              return false;
            }
        });

    // $('body').on('click', '.anchor-link', function(event){
    //   event.preventDefault();
    //   return false;
    // });
});
  //end Smooth Scrolling
