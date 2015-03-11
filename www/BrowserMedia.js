var argscheck = require('cordova/argscheck'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec'),
    _ = require('com.reallyenglish.cordova.plugin.browser-media.underscorejs');

var mediaObjects = {};

var extend = function(protoProps, staticProps) {
  var parent = this;
  var child;

  // The constructor function for the new subclass is either defined by you
  // (the "constructor" property in your `extend` definition), or defaulted
  // by us to simply call the parent's constructor.
  if (protoProps && _.has(protoProps, 'constructor')) {
    child = protoProps.constructor;
  } else {
    child = function(){ return parent.apply(this, arguments); };
  }

  // Add static properties to the constructor function, if supplied.
  _.extend(child, parent, staticProps);

  // Set the prototype chain to inherxit from `parent`, without calling
  // `parent`'s constructor function.
  var Surrogate = function(){ this.constructor = child; };
  Surrogate.prototype = parent.prototype;
  child.prototype = new Surrogate;

  // Add prototype properties (instance properties) to the subclass,
  // if supplied.
  if (protoProps) _.extend(child.prototype, protoProps);

  // Set a convenience property in case the parent's prototype is needed
  // later.
  child.__super__ = parent.prototype;

  return child;
};

var baseMedia = window.Media;
baseMedia.extend = extend;
baseMedia.MEDIA_CAN_PLAY_THROUGH = 5;
baseMedia.MEDIA_MSG = baseMedia.MEDIA_MSG.push('Can play all the way through');

window.Media = baseMedia.extend({
  constructor: function(src, successCallback, errorCallback, statusCallback){
    console.log('Wrapping this BAD BOY');

    argscheck.checkArgs('SFFF', 'Media', arguments);
    this.id = utils.createUUID();
    mediaObjects[this.id] = this;

    this.src = src;
    this.successCallback = successCallback;
    this.errorCallback = errorCallback;
    this.statusCallback = statusCallback;
    this._duration = -1;
    this._position = -1;

    exec(function(id, msgType, value){
      // window.Media.onStatus(id, baseMedia.MEDIA_STATE, value);
      window.Media.onStatus(id, msgType, value);
    }, this.errorCallback, "Media", "create", [this.id, this.src]);

    console.log('baseMedia id', this.id, 'src', this.src);
  }
},
{
  get: function(id) {
    return mediaObjects[id];
  },

  onStatus: function(id, msgType, value) {
    var media = mediaObjects[id];
    console.log('#onStatus media', media);

    if(media) {
      switch(msgType) {
        case Media.MEDIA_STATE :
          media.statusCallback && media.statusCallback(value);
          if(value === Media.MEDIA_STOPPED) {
            media.successCallback && media.successCallback();
          }
          break;

        case Media.MEDIA_DURATION :
          media._duration = value;
          break;

        case Media.MEDIA_ERROR :
          media.errorCallback && media.errorCallback(value);
          break;

        case Media.MEDIA_POSITION :
          media._position = Number(value);
          break;

        default :
          console.error && console.error("Unhandled Media.onStatus :: " + msgType);
          break;
      }
  }
  else {
    console.error && console.error("Received Media.onStatus callback for unknown media :: " + id);
  }
}
});

module.exports = window.Media;