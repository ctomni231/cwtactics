package org.wolftec.cwt.dataGrabber;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.AudioManager;
import org.wolftec.cwt.PersistenceManager;
import org.wolftec.cwt.core.Injectable;
import org.wolftec.cwt.system.Features;
import org.wolftec.cwt.system.Nullable;

public class AudioDt implements Injectable {

  /**
 *
 */
  public static final String SFX_KEY   = "SFX_";

  /**
 *
 */
  public static final String MUSIC_KEY = "MUSIC_";

  private PersistenceManager pm;
  private AudioManager       audio;
  private Features           features;

  public void grabFromCache (Callback0 callback) {

  // don't load audio when disabled
  if (!features.audioMusic && !features.audioSFX) {
    Nullable.ifPresent(callback, (cb) -> cb.$invoke());
    return;
  }

  Array<?> stuff = JSCollections.$array();

  Callback1<String> loadKey = (key) -> {
    stuff.push(function (next) {
      storage.get(key, function (value) {
        if (constants.DEBUG) {
          console.log("grab audio " + key + " from cache");
        }

        var realKey = key.slice(SFX_KEY.length);
        var arrayBuffer = Base64Helper.decodeBuffer(value);

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
}

  public void grabFromRemote (Callback0 callback) {

  // don't load audio when disabled
  if (!features.audioMusic && !features.audioSFX) {
    if (callback) {
      callback();
    }
    return;
  }

  var stuff = JSCollections.$array();

  //
  //
  // @inner
  // @param id
  // @param audioData
  // @param callback
  //
  var loadBuffer = function (id, audioData, callback) {
    audio.decodeAudio(

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
    Object.keys(mod.musics).forEach(function (key) {
      stuff.push(function (next) {
        loadFile(key, mod.musics[key], MUSIC_KEY + key, false, next);
      })
    });
  }

  // only load sfx audio when supported
  if (features.audioSFX) {
    Object.keys(mod.sounds).forEach(function (key) {
      stuff.push(function (next) {
        loadFile(key, mod.sounds[key], SFX_KEY + key, true, next);
      })
    });
  }

  async.sequence(stuff, function () {
    callback();
  });
}
}
