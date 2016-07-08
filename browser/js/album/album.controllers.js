'use strict';

juke.factory('StatsFactory', function ($q) {
  var statsObj = {};
  statsObj.totalTime = function (album) {
    var audio = document.createElement('audio');
    return $q(function (resolve, reject) {
      var sum = 0;
      var n = 0;
      function resolveOrRecur () {
        if (n >= album.songs.length) resolve(sum);
        else audio.src = album.songs[n++].audioUrl;
      }
      audio.addEventListener('loadedmetadata', function () {
        sum += audio.duration;
        resolveOrRecur();
      });
      resolveOrRecur();
    });
  };
  return statsObj;
});

juke.factory('RequestsFactory', function($log,$http) {
  var requestsObj = {};
  requestsObj.fetchAll = function() {
    return $http.get('api/albums')
    .then(function(albums){
      return albums.data;
    })
    .catch($log.error);
  }

  requestsObj.fetchById = function(id) {
    return $http.get('api/albums/'+id)
    .then(function(album){
      return album.data;
    })
    .catch($log.error);
  }

  return requestsObj;
})


juke.controller('AlbumCtrl', function ($scope, $http, $rootScope, $log, StatsFactory, RequestsFactory, PlayerFactory) {

  // load our initial data
  RequestsFactory.fetchAll()
  .then(function (albums) {
    return RequestsFactory.fetchById(albums[0].id);
  })
  .then(function (album) {

    album.imageUrl = '/api/albums/' + album.id + '/image';

    album.songs.forEach(function (song, i) {
      song.audioUrl = '/api/songs/' + song.id + '/audio';
      song.albumIndex = i;
    });

    $scope.album = album;

  })
  .catch($log.error); 
  
  $scope.isPlaying = PlayerFactory.isPlaying;
  $scope.getCurrentSong=PlayerFactory.getCurrentSong;

  // main toggle
  $scope.toggle = function (song) {
    if ($scope.isPlaying() && song === $scope.getCurrentSong()) {
      $rootScope.$broadcast('pause');
    } else{ 
      $rootScope.$broadcast('play', song);}
  };

  // incoming events (from Player, toggle, or skip)
  $scope.$on('pause',PlayerFactory.pause);
  $scope.$on('play', function(event, song) {
    if ($scope.getCurrentSong() === song){
      PlayerFactory.resume();
    }
    else PlayerFactory.start(song, $scope.album.songs);
  });
  $scope.$on('next',PlayerFactory.next);
  $scope.$on('prev',PlayerFactory.previous);
  
});
