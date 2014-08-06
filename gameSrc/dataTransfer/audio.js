var constants = require("../constants");
var features = require("../systemFeatures");
var storage = require("../storage");
var assert = require("../functions").assert;
var async = require("../async");
var audio = require("../audio");

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
exports.grabFromCache = function (callback) {

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

        if (constants.DEBUG) assert(obj.value);

        var realKey = obj.key.slice(SFX_KEY.length);
        var arrayBuffer = Base64Helper.decodeBuffer(obj.value);

        audio.decodeAudio(

          // buffer
          arrayBuffer,

          // success handling
          function (buffer) {
            audio.registerAudioBuffer(realKey, buffer);
            if (next) next(true);
          },

          // error handling
          function () {
            require("../error").raiseError("could not load audio from cache","audioDTO");
          }
        );
      });
    });
  }

  // load all possible audio (except music) keys from the storage into the RAM
  storage.keys(function (keys) {
    for (var i = 0, e = keys.length; i < e; i++) {
      var key = keys[i];
      if (key.indexOf(SFX_KEY) === 0) {
        loadKey(key);
      }
    }

    async.sequence(stuff, function () {
      callback();
    });
  });
};

//
//
// @param {Function} callback
//
exports.grabFromRemote = function (callback) {

  // don't load audio when disabled
  if (!features.audioMusic && !features.audioSFX) {
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
    audioData.decodeAudio(

      // buffer data
      audioData,

      // success handling
      function (buffer) {
        audio.registerAudioBuffer(id, buffer);
        if (callback) {
          callback();
        }
      },

      // error handling
      function (e) {
        require("../error").raiseError("could not load audio from remote","audioDTO");
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

    request.open("GET", constants.MOD_PATH + path, true);
    request.responseType = "arraybuffer";

    request.onload = function () {
      assert(this.status !== 404);

      if (constants.DEBUG) {
        console.log("load " + path + " for key " + key + " successfully");
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

  var mod = require("../dataTransfer/mod").getMod();

  // only load music when supported
  if (features.audioMusic) {
    Object.keys(mod.Musics).forEach(function (key) {
      stuff.push(function (next) {
        loadFile(key, mod.Musics[key], MUSIC_KEY + key, false, next);
      })
    });
  }

  // only load sfx audio when supported
  if (features.audioSFX) {
    Object.keys(mod.Sounds).forEach(function (key) {
      stuff.push(function (next) {
        loadFile(key, mod.Sounds[key], SFX_KEY + key, true, next);
      })
    });
  }

  async.sequence(stuff, function () {
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