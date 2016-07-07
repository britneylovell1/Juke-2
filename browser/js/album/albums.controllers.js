juke.controller('AlbumsCtrl', function ($scope, $log, RequestsFactory) {
  RequestsFactory.fetchAll()
  .then(function (albums) {
    return albums.map(function(album) {
    	return RequestsFactory.fetchById(album.id);
    })
  })
  .then(function(albumPromises) {
  	return Promise.all(albumPromises);
  })
  .then(function(albums) {
	$scope.albums = albums;
	albums.forEach(function(album) {
		album.imageUrl = '/api/albums/' + album.id + '/image';
	})
  })
  .catch($log.error);
});
