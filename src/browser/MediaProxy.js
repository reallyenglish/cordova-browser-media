// var jQuery = require('com.reallyenglish.cordova.plugin.browser-media.jQuery');
var jQuery = window.com.reallyenglish.cordova.plugin.browsermedia.lib.jQuery;
jQuery.noConflict(true);

var MEDIA_CAN_PLAY_THROUGH = 5;

module.exports = {
  create: function(){
    var canPlayCallback = Array.prototype.slice.call(arguments, 0, 1)[0],
        args = Array.prototype.slice.call(arguments, 2)[0],
        id = args[0],
        src = args[1];

    console.log('MediaProxy#create canPlayCallback', canPlayCallback);
    console.log('MediaProxy#create id', id, 'src', src);

    jQuery( document ).ready(function() {
      console.log('MediaProxy#create document ready');

      var playerDiv = document.createElement("div");
      playerDiv.id = 'jquery_jplayer_' + id;

      document.body.appendChild(playerDiv);
      // http://www.freesfx.co.uk/rx2/mp3s/10/11333_1399100038.mp3

      jQuery('#' + playerDiv.id).jPlayer({
        noConflict: 'window.com.reallyenglish.cordova.plugin.browsermedia.lib.jQuery',
        ready: function(){
          jQuery(this).jPlayer("setMedia", {
            mp3: src
          });
        },

        canplaythrough: function(e){
          console.log('MediaProxy#create CANPLAYTHROUGH event', e);
          canPlayCallback(id, MEDIA_CAN_PLAY_THROUGH);
        },

        play: function(e){
          console.log('MediaProxy#create PLAY event', e);
        },

        wmode:"window",
        supplied: "mp3",
        swfPath: "scripts/jquery.jplayer.swf",
        preload: 'auto',
        solution: 'html, flash'
      });
    });
  },

  startPlayingAudio: function(){
    var args = Array.prototype.slice.call(arguments, 2)[0],
        id = args[0],
        src = args[1],
        options = args[2],
        jPlayerId = 'jquery_jplayer_' + id;

    if(!jQuery('#' + jPlayerId)){ return; }

    console.log('MediaProxy#startPlayingAudio jPlayerId', jPlayerId);
    jQuery('#' + jPlayerId).jPlayer('play');
  },

  stopPlayingAudio: function(){ console.log('stopPlayingAudio!'); },

  seekToAudio: function(){ console.log('seekToAudio!'); },

  pausePlayingAudio: function(){ console.log('pausePlayingAudio!'); },

  getCurrentPositionAudio: function(){ console.log('getCurrentPositionAudio!'); },

  startRecordingAudio: function(){},

  stopRecordingAudio: function(){},

  release: function(){ console.log('release'); },

  setVolume: function(){ console.log('setVolume'); }
};

require("cordova/exec/proxy").add("Media", module.exports);