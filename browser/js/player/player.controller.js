'use strict';

juke.controller('PlayerCtrl', function ($scope, $rootScope, PlayerFactory) {

  $scope.isPlaying = PlayerFactory.isPlaying;
  $scope.getCurrentSong=PlayerFactory.getCurrentSong;

  // main toggle
  $scope.toggle = function (song) {
    if ($scope.isPlaying()) $rootScope.$broadcast('pause');
    else $rootScope.$broadcast('play', song);
  };

  // functionality
  $scope.next = PlayerFactory.next;
  $scope.prev = PlayerFactory.previous;
  $scope.getProgress=PlayerFactory.getProgress;
  $scope.handleProgressClick = function (evt) {
    PlayerFactory.seek(evt.offsetX / evt.currentTarget.scrollWidth);
  };

});
