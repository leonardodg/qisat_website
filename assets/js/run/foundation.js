(function() {
   'use strict';

	angular.module('QiSatApp')
		.run(function($rootScope, $document, $timeout){

			var config = {
			    	accordion: {
			      		callback: function(accordion) {                           
			      			$document.foundation('equalizer', 'reflow');
			    		}
			    	},
			  		equalizer: {
			    		equalize_on_stack: true,
			    		act_on_hidden_el: true,
			    		after_height_change: function() {
			        		$document.foundation('accordion', 'reflow');
			    		}
			  		},			  
			  		"magellan-expedition": {
				  		active_class: 'navigation_courses__list-item-active', // specify the class used for active sections
				  		threshold: 0, // how many pixels until the magellan bar sticks, 0 = auto
				  		destination_threshold: 20, // pixels from the top of destination for it to be considered active
				  		throttle_delay: 50, // calculation throttling to increase framerate
				  		fixed_top: 0, // top distance in pixels assigend to the fixed element on scroll
				  		offset_by_height: true // whether to offset the destination by the expedition height. Usually you want this to be true, unless your expedition is on the side.
					}
				};

		    	$rootScope.$on('$viewContentLoaded', function () {
				    $rootScope.$apply($document.foundation(config));
				    $rootScope.$apply($document.foundation());
				    $rootScope.$apply($document.foundation('equalizer', 'reflow'));
			    });
		});
		
}());