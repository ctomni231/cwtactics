var features = require("../systemFeatures");
var storage = require("../storage");
var audio = require("../audio");
var constants = require("../constants");

//
// Storage parameter for sfx volume.
//
// @constant
//
var SFX_VOLUME_KEY = "cfg_sfx_volume";

//
// Storage parameter for music volume.
//
// @constant
//
var MUSIC_VOLUME_KEY = "cfg_music_volume";

//
// @constant
//
var SFX_KEY = "SFX_";

//
// @constant
//
var MUSIC_KEY = "MUSIC_";

//
//
// @param {Function} callback
//
exports.grabFromCache = function (callback, bufferCallback) {
  // don't load audio when disabled
  if (!features.audioMusic && !features.audioSFX) {
    if (callback) {
      callback();
    }
    return;
  }

  var stuff = [];

  function loadKey(key) {
    stuff.push(function (next) {
      storage.get(key, function (obj) {
        if (constants.DEBUG) {
          console.log("grab audio " + key + " from cache");
        }

        if (constants.DEBUG) cwt.assert(obj.value);

        var realKey = obj.key.slice(cwt.Audio.SFX_KEY.length);
        var arrayBuffer = Base64Helper.decodeBuffer(obj.value);
        cwt.Audio.context_.decodeAudioData(arrayBuffer,

          // success handling
          function (buffer) {
            audio.registerAudioBuffer(realKey, buffer);
            if (next) next(true);
          },

          // error handling
          function (e) {
            if (next) next(false);
          }
        );
      });
    });
  }

  // load all possible audio (except music) keys from the storage into the RAM
  storage.keys(function (keys) {
    for (var i = 0, e = keys.length; i < e; i++) {
      var key = keys[i];
      if (key.indexOf(cwt.Audio.SFX_KEY) === 0) {
        loadKey(key);
      }
    }

    callAsSequence(stuff, function () {
      callback();
    });
  });
};

//
//
// @param {Function} callback
//
exports.grabFromRemote = function (callback) {
  this.removeGrabbers_(); // remove initializer functions
  if (!this.context_) { // don't load audio when disabled
    if (callback) {
      callback();
    }
    return;
  }

  var stuff = [];

  //
  //
  // @inner
  // @param id
  // @param audioData
  // @param callback
  //
  var loadBuffer = function (id, audioData, callback) {
    cwt.Audio.context_.decodeAudioData(

      // buffer data
      audioData,

      // success handling
      function (buffer) {
        cwt.Audio.registerAudioBuffer(id, buffer);
        if (callback) {
          callback();
        }
      },

      // error handling
      function (e) {
        cwt.Error(e, "ERR_AUDIO_BUFFER_LOAD");
      }
    );
  };

  //
  //
  // @inner
  // @param key
  // @param path
  // @param saveKey
  // @param loadIt
  // @param callback
  //
  var loadFile = function (key, path, saveKey, loadIt, callback) {
    if (constants.DEBUG) {
      console.log("going to load " + path + " for key " + key);
    }

    var request = new XMLHttpRequest();

    request.open("GET", cwt.MOD_PATH + path, true);
    request.responseType = "arraybuffer";

    request.onload = function () {
      cwt.assert(this.status !== 404);

      if (cwt.DEBUG) {
        console.log("load " + path + " for key " + key + " sucessfully");
      }

      storage.set(saveKey,
        Base64Helper.encodeBuffer(request.response),
        function () {
          if (loadIt) {
            loadBuffer(key, request.response, callback);
          } else {
            callback();
          }
        }
      );
    };

    request.send();
  };

  // only load music when supported
  if (features.audioMusic) {
    Object.keys(cwt.Musics).forEach(function (key) {
      stuff.push(function (next) {
        loadFile(key, cwt.Musics[key], cwt.Audio.MUSIC_KEY + key, false, next);
      })
    });
  }

  // only load sfx audio when supported
  if (features.audioSFX) {
    Object.keys(cwt.Sounds).forEach(function (key) {
      stuff.push(function (next) {
        loadFile(key, cwt.Sounds[key], cwt.Audio.SFX_KEY + key, true, next);
      })
    });
  }

  callAsSequence(stuff, function () {
    callback();
  });
};



//
// Saves the configurations for the audio volume in the user storage.
//
// @param {Function=} callback Callback function
//
exports.saveVolumeConfigs = function (callback) {

  // sfx volume
  storage.set(
    SFX_VOLUME_KEY,
    audio.getSfxVolume(),

    // music volume
    function () {
      storage.set(
        MUSIC_VOLUME_KEY,
        audio.getMusicVolume(),

        // callback
        function () {
          if (callback) {
            callback();
          }
        }
      );
    }
  );
};

//
// Loads the volume configuration from the user storage.
//
// @param {Function=} callback Callback function
//
exports.loadVolumeConfigs = function (callback) {

  // sfx config
  storage.get(SFX_VOLUME_KEY, function (obj) {
    if (obj) {
      audio.setSfxVolume(obj.value);
    }

    // music config
    storage.get(MUSIC_VOLUME_KEY, function (obj) {
      if (obj) {
        audio.setMusicVolume(obj.value);
      }

      // callback if given
      if (callback) {
        callback();
      }
    });
  });
};