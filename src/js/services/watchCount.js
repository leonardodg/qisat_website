(function () {
	'use strict';

	// -------------------------------------------------- //
	// http://www.bennadel.com/blog/2698-counting-the-number-of-watchers-in-angularjs.htm
	// -------------------------------------------------- //

	// I get a rough estimate of the number of watchers on the page. This assumes 
	// that the entire page is inside the same AngularJS application. 
	angular
		.module('QiSatApp')
		.factory("getWatchCount",
			function () {
				// I return the count of watchers on the current page.
				function getWatchCount() {
					var total = 0;
					// AngularJS denotes new scopes in the HTML markup by appending the
					// class "ng-scope" to appropriate elements. As such, rather than
					// attempting to navigate the hierarchical Scope tree, we can simply
					// query the DOM for the individual scopes. Then, we can pluck the
					// watcher-count from each scope.
					// --
					// NOTE: Ordinarily, it would be a HUGE SIN for an AngularJS service
					// to access the DOM (Document Object Model). But, in this case,
					// we're not really building a true AngularJS service, so we can
					// break the rules a bit.
					angular.element(".ng-scope").each(
						function ngScopeIterator() {
							// Get the scope associated with this element node.
							var scope = $(this).scope();
							// The $$watchers value starts out as NULL.
							total += scope.$$watchers ? scope.$$watchers.length : 0;
						}
					);
					return (total);
				}
				// For convenience, let's serialize the above method and convert it to
				// a bookmarklet that can easily be run on ANY AngularJS page.
				getWatchCount.bookmarklet = ("javascript:alert('Watchers:'+(" + getWatchCount.toString().replace(/\/\/.*/g, " ").replace(/\s+/g, " ") + ")());void(0);");
				return (getWatchCount);
			}
		);
}());