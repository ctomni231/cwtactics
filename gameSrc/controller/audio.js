cwt.Audio = {

  /**
   * Storage parameter for sfx volume.
   *
   * @constant
   */
  SFX_VOLUME_KEY: "cfg_sfx_volume",

  /**
   * Storage parameter for music volume.
   *
   * @constant
   */
  MUSIC_VOLUME_KEY: "cfg_music_volume",

  /**
   * @constant
   */
  SFX_KEY: "SFX_",

  /**
   * @constant
   */
  MUSIC_KEY: "MUSIC_",

  /**
   * WebAudio context object.
   *
   * @private
   */
  context_: null,

  /**
   * Music audio node.
   *
   * @private
   */
  gainNode_music_: null,

  /**
   * SFX audio node.
   *
   * @private
   */
  gainNode_sfx_: null,

  /**
   * Cache for audio buffers.
   *
   * @private
   */
  buffer_: {},

  /**
   * Current played music object.
   *
   * @private
   */
  currentMusic_: {
    inLoadProcess: false,
    connector: null,
    id: null
  },

  /**
   * Initializes the audio context.
   */
  initialize: function () {

    // if audio sfx and music is deactivated then do not initialize the audio context
    if (cwt.ClientFeatures.audioSFX || cwt.ClientFeatures.audioMusic) {

      // construct new context
      if (window.AudioContext) {
        this.context_ = new window.AudioContext();
      } else if (window.webkitAudioContext) {
        this.context_ = new window.webkitAudioContext();
      }

      // construct audio nodes
      if (this.context_) {
        this.gainNode_sfx_ = this.context_.createGainNode();
        this.gainNode_sfx_.gain.value = 1;
        this.gainNode_sfx_.connect(this.context_.destination);
        this.gainNode_music_ = this.context_.createGainNode();
        this.gainNode_music_.gain.value = 0.5;
        this.gainNode_music_.connect(this.context_.destination);
      }

      // remove initializer
      delete cwt.Audio.initialize;
      cwt.Audio.initialized = true;
    }
  },

  /**
   * Returns a web audio context. If no context is initialized then it will be created first.
   */
  grabContext: function () {
    return this.context_;
  },

  /**
   * Returns the value of the sfx audio node.
   */
  getSfxVolume: function () {
    if (!this.context_) return;

    return this.gainNode_sfx_.gain.value;
  },

  /**
   * Returns the value of the music audio node.
   */
  getMusicVolume: function () {
    if (!this.context_) {
      return;
    }

    return this.gainNode_music_.gain.value;
  },

  /**
   * Sets the value of the sfx audio node.
   */
  setSfxVolume: function (vol) {
    if (!this.context_) return;

    if (vol < 0) {
      vol = 0;
    } else if (vol > 1) {
      vol = 1;
    }

    this.gainNode_sfx_.gain.value = vol;
  },

  /**
   * Sets the value of the music audio node.
   */
  setMusicVolume: function (vol) {
    if (!this.context_) return;

    if (vol < 0) {
      vol = 0;
    } else if (vol > 1) {
      vol = 1;
    }

    this.gainNode_music_.gain.value = vol;
  },

  /**
   * Saves the configurations for the audio volume in the user storage.
   *
   * @param {Function=} callback Callback function
   */
  saveConfigs: function (callback) {
    if (!this.context_) {
      if (callback) {
        callback();
      }
      return;
    }

    // sfx volume
    cwt.Storage.generalStorage.set(
      cwt.Audio.SFX_VOLUME_KEY,
      cwt.Audio.gainNode_sfx_.gain.value,

      // music volume
      function () {
        cwt.Storage.generalStorage.set(
          cwt.Audio.MUSIC_VOLUME_KEY,
          cwt.Audio.gainNode_music_.gain.value,

          // callback
          function () {
            if (callback) {
              callback();
            }
          }
        );
      }
    );
  },

  /**
   * Loads the volume configuration from the user storage.
   *
   * @param {Function=} callback Callback function
   */
  loadConfigs: function (callback) {
    if (!this.context_) {
      if (callback) {
        callback();
      }
      return;
    }

    // sfx config
    cwt.Storage.generalStorage.get(cwt.Audio.SFX_VOLUME_KEY, function (obj) {
      if (obj) {
        cwt.Audio.gainNode_sfx_.gain.value = obj.value;
      }

      // music config
      cwt.Storage.generalStorage.get(cwt.Audio.MUSIC_VOLUME_KEY, function (obj) {
        if (obj) {
          cwt.Audio.gainNode_music_.gain.value = obj.value;
        }

        // callback if given
        if (callback) {
          callback();
        }
      });
    });
  },

  /**
   * Registers an audio buffer object.
   *
   * @param id
   * @param buff
   */
  registerAudioBuffer: function (id, buff) {
    if (cwt.DEBUG) cwt.assert(!this.isBuffered(id));

    this.buffer_[id] = buff;
  },

  /**
   * Removes a buffer from the cache.
   */
  unloadBuffer: function (id) {
    if (cwt.DEBUG) cwt.assert(this.isBuffered(id));

    delete this.buffer_[id];
  },

  /**
   *
   * @param id
   * @return {boolean}
   */
  isBuffered: function (id) {
    return this.buffer_.hasOwnProperty(id);
  },

  /**
   * Plays an empty sound buffer. Useful to
   * initialize the audio system.
   */
  playNullSound: function () {
    if (!this.context_) return;

    var buffer = this.context_.createBuffer(1, 1, 22050);
    var source = this.context_.createBufferSource();

    source.buffer = buffer;
    source.connect(this.context_.destination);
    source.noteOn(0);
  },

  playSoundOnNode_: function (gainNode, buffer, loop) {
    var source = this.context_.createBufferSource();

    // is loop enabled ?
    if (loop) {
      source.loop = true;
    }

    source.buffer = buffer;
    source.connect(gainNode);
    source.noteOn(0);

    return source;
  },

  /**
   * Plays a sound.
   *
   * @param {string} id id of the sound that will be played
   * @param {boolean=} loop (default:false)
   * @return {*}
   */
  playSound: function (id, loop) {
    if (!this.context_) return null;
    if (cwt.DEBUG) cwt.assert(this.buffer_[id]);

    return this.playSoundOnNode_(this.gainNode_sfx_, this.buffer_[id], loop);
  },

  /**
   *
   * @param obj
   * @private
   */
  musicLoaderCallback_: function (obj) {
    if (cwt.DEBUG) cwt.assert(obj.value);

    this.currentMusic_.connector = this.playSoundOnNode_(
      this.gainNode_music_,
      Base64Helper.decodeBuffer(obj.value),
      true
    );

    // release loading lock
    this.currentMusic_.inLoadProcess = false;
  },

  /**
   * Plays a background music.
   *
   * @param id id of the music object
   */
  playMusic: function (id) {
    if (!this.context_ || this.currentMusic_.inLoadProcess) return false;

    // already playing this music ?
    if (this.currentMusic_.id === id) {
      return;
    }

    // stop old music
    if (this.currentMusic_.connector) {
      this.stopMusic();
    }

    // set meta data
    this.currentMusic_.inLoadProcess = true;
    this.currentMusic_.id = id;
    cwt.Storage.generalStorage.get(this.MUSIC_KEY + id, this.musicLoaderCallback_);

    return true;
  },

  /**
   * Stop existing background music.
   */
  stopMusic: function () {
    if (!this.context_ || this.currentMusic_.inLoadProcess) return false;

    // disable current music
    if (this.currentMusic_) {
      this.currentMusic_.connector.noteOff(0);
      this.currentMusic_.connector.disconnect(0);
    }

    // remove meta data
    this.currentMusic_.connector = null;
    this.currentMusic_.id = null;
    this.currentMusic_.inLoadProcess = false;

    return true;
  },

  /**
   *
   * @private
   */
  removeGrabbers_: function () {
    delete cwt.Audio.removeGrabbers_;
    delete cwt.Audio.grabFromCache;
    delete cwt.Audio.grabFromRemote;
  },

  /**
   *
   * @param {Function} callback
   */
  grabFromCache: function (callback) {
    this.removeGrabbers_(); // remove initializer functions
    if (!this.context_) { // don't load audio when disabled
      if (callback) {
        callback();
      }
      return;
    }

    var stuff = [];

    function loadKey(key) {
      stuff.push(function (next) {
        cwt.Storage.assetsStorage.get(key, function (obj) {
          if (cwt.DEBUG) {
            console.log("grab audio "+key+" from cache");
          }

          if (cwt.DEBUG) cwt.assert(obj.value);

          var realKey = obj.key.slice(cwt.Audio.SFX_KEY.length);
          var arrayBuffer = Base64Helper.decodeBuffer(obj.value);
          cwt.Audio.context_.decodeAudioData( arrayBuffer,

            // success handling
            function(buffer) {
              cwt.Audio.registerAudioBuffer(realKey,buffer);
              if( next ) next(true);
            },

            // error handling
            function( e ){
              if( next ) next(false);
            }
          );
        });
      });
    }

    // load all possible audio (except music) keys from the storage into the RAM
    cwt.Storage.assetsStorage.keys(function (keys) {
      for (var i = 0, e = keys.length; i < e; i++) {
        var key = keys[i];
        if (key.indexOf(cwt.Audio.SFX_KEY) === 0) {
          loadKey(key);
        }
      }

      callAsSequence(stuff, function (){
        delete cwt.Sounds;
        delete cwt.Musics;
        callback();
      });
    });
  },

  /**
   *
   * @param {Function} callback
   */
  grabFromRemote: function (callback) {
    this.removeGrabbers_(); // remove initializer functions
    if (!this.context_) {// don't load audio when disabled
      if (callback) {
        callback();
      }
      return;
    }

    var stuff = [];

    /**
     *
     * @inner
     * @param id
     * @param audioData
     * @param callback
     */
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

    /**
     *
     * @inner
     * @param key
     * @param path
     * @param saveKey
     * @param loadIt
     * @param callback
     */
    var loadFile = function (key, path, saveKey, loadIt, callback) {
      if (cwt.DEBUG) {
        console.log("going to load "+path+" for key "+key);
      }

      var request = new XMLHttpRequest();

      request.open("GET", cwt.MOD_PATH+path, true);
      request.responseType = "arraybuffer";

      request.onload = function () {
        cwt.assert(this.status !== 404);

        if (cwt.DEBUG) {
          console.log("load "+path+" for key "+key+" sucessfully");
        }

        cwt.Storage.assetsStorage.set(saveKey,
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
    if (cwt.ClientFeatures.audioMusic) {
      Object.keys(cwt.Musics).forEach(function (key) {
        stuff.push(function (next) {
          loadFile(key, cwt.Musics[key], cwt.Audio.MUSIC_KEY + key, false, next);
        })
      });
    }

    // only load sfx audio when supported
    if (cwt.ClientFeatures.audioSFX) {
      Object.keys(cwt.Sounds).forEach(function (key) {
        stuff.push(function (next) {
          loadFile(key, cwt.Sounds[key], cwt.Audio.SFX_KEY + key, true, next);
        })
      });
    }

    callAsSequence(stuff, function (){
      delete cwt.Sounds;
      delete cwt.Musics;
      callback();
    });
  }
};