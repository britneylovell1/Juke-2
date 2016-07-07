'use strict';

juke.factory('PlayerFactory', function(){
  // non-UI logic in here
  var playerObj = {};
  var audio = document.createElement('audio'); 
  var playing = false;
  var currentSong=null;
  var nextSong=null;
  var previousSong=null;
  var progress = 0;

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
  });

  playerObj.start = function(song,songList){
  	currentSong=song;
  	if(songList){
  		setNextSong(song,songList);
  		setPreviousSong(song,songList);
  	}
 	this.pause();
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
  	this.start(nextSong);
  }

  playerObj.previous=function(){
  	this.start(previousSong);
  }

  playerObj.getProgress=function(){
  	return progress;
  }

  return playerObj;
});








