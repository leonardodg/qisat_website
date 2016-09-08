angular.module('QiSatApp').controller(
			"WatchCount",
			function( $scope, getWatchCount ) {
				

				// I hold the current count of watchers in the current page. This extends
				// beyond the current scope, and will hold the count for all scopes on 
				// the entire page.
				$scope.watchCount = 0;

				// I hold the bookmarkletized version of the function to provide a take-
				// away feature that can be used on any AngularJS page.
				$scope.bookmarklet = getWatchCount.bookmarklet;


				// Every time the digest runs, it's possible that we'll change the number
				// of $watch() bindings on the current page. 
				$scope.$watch(
					function watchCountExpression() {

						return( getWatchCount() );

					},
					function handleWatchCountChange( newValue ) {

						$scope.watchCount = newValue;

					}
				);
			}
		);

