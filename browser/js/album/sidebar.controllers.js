juke.controller('SidebarCtrl', function ($scope,$rootScope) {

	$scope.viewAlbums = function() {
		console.log("clicked on sidebar")
		// event emitter - to albums to ng-show album images
		$rootScope.$broadcast('revealAlbums');
	}
})