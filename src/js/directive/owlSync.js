(function () {
	"use strict";

	angular
		.module('QiSatApp')
		.directive('owlSync', ['$timeout',
			function ($timeout) {
				return {
					restrict: 'A',
					link: function (scope, element, attrs) {
						var init;
						var sync1 = angular.element("#gallery-sync_bigger");
						var sync2 = angular.element("#gallery-sync_thumb");
						var slidesPerPage = 6; //globaly define number of elements per page
						var syncedSecondary = true;

						function syncPosition(el) {
							//if you set loop to false, you have to restore this next line
							//var current = el.item.index;

							//if you disable loop you have to comment this block
							var count = el.item.count - 1;
							var current = Math.round(el.item.index - (el.item.count / 2) - 0.5);
							if (current < 0) {
								current = count;
							}
							if (current > count) {
								current = 0;
							}
							//end block

							if (sync2) {
								sync2
									.find(".owl-item")
									.removeClass("current")
									.eq(current)
									.addClass("current");
								var onscreen = sync2.find('.owl-item.active').length - 1;
								var start = sync2.find('.owl-item.active').first().index();
								var end = sync2.find('.owl-item.active').last().index();

								if (current > end) {
									sync2.data('owl.carousel').to(current, 100, true);
								}
								if (current < start) {
									sync2.data('owl.carousel').to(current - onscreen, 100, true);
								}
							}
						}

						function syncPosition2(el) {
							if (syncedSecondary && sync1) {
								var number = el.item.index;
								sync1.data('owl.carousel').to(number, 100, true);
							}
						}

						if (attrs.name == "owl-carousel-institucional") {

							sync1.owlCarousel({
								items: 1,
								slideSpeed: 4000,
								smartSpeed: 1500,
								nav: true,
								autoplay: true,
								dots: false,
								loop: true,
								responsiveRefreshRate: 200,
								navText: ['<svg width="100%" height="100%" viewBox="0 0 11 20"><path style="fill:none;stroke-width: 1px;stroke: #000;" d="M9.554,1.001l-8.607,8.607l8.607,8.606"/></svg>', '<svg width="100%" height="100%" viewBox="0 0 11 20" version="1.1"><path style="fill:none;stroke-width: 1px;stroke: #000;" d="M1.054,18.214l8.606,-8.606l-8.606,-8.607"/></svg>'],
							}).on('changed.owl.carousel', syncPosition);

							sync2
								.on('initialized.owl.carousel', function () {
									sync2.find(".owl-item").eq(0).addClass("current");
								})
								.owlCarousel({
									items: slidesPerPage,
									dots: false,
									nav: false,
									smartSpeed: 1500,
									slideSpeed: 3500,
									slideBy: slidesPerPage, //alternatively you can slide by 1, this way the active slide will stick to the first item in the second carousel
									responsiveRefreshRate: 100
								}).on('changed.owl.carousel', syncPosition2);

							sync2.on("click", ".owl-item", function (e) {
								e.preventDefault();
								var number = $(this).index();
								sync1.data('owl.carousel').to(number, 300, true);
							});

						} else if (attrs.name == "owl-carousel-testimonials-home") {
							init = function () {
								element.owlCarousel({
									navigation: false, // Show next and prev buttons
									slideSpeed: 300,
									paginationSpeed: 400,
									singleItem: true,
									autoHeight: true,

									//"singleItem:true" is a shortcut for:
									items: 1,
									itemsDesktop: false,
									itemsDesktopSmall: false,
									itemsTablet: false,
									itemsMobile: false
								});
							};
							$timeout(init, 0);
						} else if (attrs.name == "owl-carousel-instrutor-produto") {
							init = function () {
								element.owlCarousel({
									items: 4,
									nav: true,
									dots: false,
									navText: ['<svg width="100%" height="100%" viewBox="0 0 11 20"><path style="fill:none;stroke-width: 1px;stroke: #000;" d="M9.554,1.001l-8.607,8.607l8.607,8.606"/></svg>', '<svg width="100%" height="100%" viewBox="0 0 11 20" version="1.1"><path style="fill:none;stroke-width: 1px;stroke: #000;" d="M1.054,18.214l8.606,-8.606l-8.606,-8.607"/></svg>'],
									responsiveClass: true,
									responsive: {
										0: {
											items: 1,
											autoplay: true
										},
										600: {
											items: 2
										},
										1000: {
											items: 4
										}
									}
								});
							};
							$timeout(init, 0);
						}
					}
				}
			}]);

}());