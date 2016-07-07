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

    // Why doesn't this work?
    // StatsFactory.totalTime(album)
    // .then(function(time) {
    //   album.totalTime = time;
    //   console.log(time);
    // })
    // .catch($log.error);

    album.imageUrl = '/api/albums/' + album.id + '/image';

    album.songs.forEach(function (song, i) {
      song.audioUrl = '/api/songs/' + song.id + '/audio';
      song.albumIndex = i;
    });

    $scope.album = album;

    // StatsFactory.totalTime(album)
    // .then(function (albumDuration) {
    //   // console.log(albumDuration);
    //   $scope.fullDuration = albumDuration;
    // });

  })
  .catch($log.error); // $log service can be turned on and off; also, pre-bound

  // main toggle
  $scope.toggle = function (song) {
    if ($scope.playing && song === $scope.currentSong) {
      $rootScope.$broadcast('pause');
    } else $rootScope.$broadcast('play', song);
  };

  // incoming events (from Player, toggle, or skip)

  $scope.$on('pause',PlayerFactory.pause);
  $scope.$on('play',PlayerFactory.start);
  $scope.$on('next',PlayerFactory.next);
  $scope.$on('prev',PlayerFactory.previous);
  

  //(REMOVED EVENTS)
  // $scope.$on('pause', pause);
  // $scope.$on('play', play);
  // $scope.$on('next', next);
  // $scope.$on('prev', prev);

  // // functionality
  // function pause () {
  //   $scope.playing = false;
  // }
  // function play (event, song) {
  //   $scope.playing = true;
  //   $scope.currentSong = song;
  // };

  // // a "true" modulo that wraps negative to the top of the range
  // function mod (num, m) { return ((num % m) + m) % m; };

  // // jump `interval` spots in album (negative to go back, default +1)
  // function skip (interval) {
  //   if (!$scope.currentSong) return;
  //   var index = $scope.currentSong.albumIndex;
  //   index = mod( (index + (interval || 1)), $scope.album.songs.length );
  //   $scope.currentSong = $scope.album.songs[index];
  //   if ($scope.playing) $rootScope.$broadcast('play', $scope.currentSong);
  // };
  // function next () { skip(1); };
  // function prev () { skip(-1); };

});
