'use strict';

juke.factory('PlayerFactory', function($rootScope){
  // non-UI logic in here
  var playerObj = {};
  var audio = document.createElement('audio'); 
  var playing = false;
  var currentSong=null;
  var nextSong=null;
  var previousSong=null;
  var progress = 0;
  var currentSongList=null;

  function mod (num, m) { return ((num % m) + m) % m; }

  var setNextSong=function(song,songList){
  	var nextSongIndex=mod(songList.indexOf(song)+1,songList.length);
  	nextSong=songList[nextSongIndex];
  }

  var setPreviousSong=function(song,songList){
  	var previousSongIndex=mod(songList.indexOf(song)-1,songList.length);
  	previousSong=songList[previousSongIndex];
  }

  audio.addEventListener('timeupdate', function () {
    progress = audio.currentTime / audio.duration;
    $rootScope.$digest();
  });

  audio.addEventListener('ended', function () {
    playerObj.next();
    $rootScope.$digest(); 
  });

  playerObj.start = function(song,songList){
  	currentSongList = songList;
  	currentSong=song;
  	if(songList){
  		setNextSong(song,songList);
  		setPreviousSong(song,songList);
  	}
 	playerObj.pause();
	audio.src = song.audioUrl;
	audio.load();
	audio.play();
	playing = true;
  }

  playerObj.pause = function(){
  	audio.pause();
  	playing = false;

  }

  playerObj.resume = function(){
  	audio.play();
  	playing = true;
  }

  playerObj.isPlaying = function() {
  	return playing;
  }

  playerObj.getCurrentSong=function(){
  	return currentSong;
  }

  playerObj.next=function(){
  	playerObj.start(nextSong,currentSongList);
  }

  playerObj.previous=function(){
  	playerObj.start(previousSong,currentSongList);
  }

  playerObj.getProgress=function(){
  	return progress;
  }

  playerObj.seek=  function(decimal) {
    audio.currentTime = audio.duration * decimal;
  }

  return playerObj;
});








