cwt.Audio = {

  /**
   * Storage parameter for sfx volume.
   */
  SFX_STORAGE_PARAMETER: "volume_sfx",

  /**
   * Storage parameter for music volume.
   */
  MUSIC_STORAGE_PARAMETER: "music_sfx",

  /**
   * WebAudio context object.
   */
  context_: null,

  /**
   * Music audio node.
   */
  gainNode_music_: null,

  /**
   * SFX audio node.
   */
  gainNode_sfx_: null,

  /**
   * Cache for audio buffers.
   */
  buffer_: {},

  /**
   * Current played music object.
   */
  currentMusic_: {
    connector: null,
    id: null
  },

  /**
   * Initializes the audio context.
   */
  initialize: function (p, b) {

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
    if (!this.context_) return;

    // sfx volume
    cwt.Storage.generalStorage.set(
      this.SFX_STORAGE_PARAMETER,
      this.gainNode_sfx_.gain.value,

      // music volume
      function () {
        cwt.Storage.generalStorage.set(
          this.MUSIC_STORAGE_PARAMETER,
          this.gainNode_music_.gain.value,

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
      return;
    }

    // sfx config
    cwt.Storage.generalStorage.get(this.SFX_STORAGE_PARAMETER, function (obj) {
      if (obj) {
        this.gainNode_sfx_.gain.value = obj.value;
      }

      // music config
      cwt.Storage.generalStorage.get(this.MUSIC_STORAGE_PARAMETER, function (obj) {
        if (obj) {
          this.gainNode_music_.gain.value = obj.value;
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

  /**
   * Plays a sound effect.
   */
  playSound: function (id, loop, isMusic) {
    if (!this.context_) return;
    if (!this.buffer_[id]) return; // not buffered, just ignore it

    var gainNode = (isMusic) ? this.gainNode_music_ : this.gainNode_sfx_;
    var source = this.context_.createBufferSource();

    // is loop enabled ?
    if (loop) {
      source.loop = true;
    }

    source.buffer = this.buffer_[id];
    source.connect(gainNode);
    source.noteOn(0);

    return source;
  },

  /**
   * Plays a background music.
   */
  playMusic: function (id) {
    if (!this.context_) return;

    // already playing this music ?
    if (this.currentMusic_.id === id) return;

    this.stopMusic();

    // set meta data
    this.currentMusic_.connector = this.playSound(id, true, true);
    this.currentMusic_.id = id;
  },

  /**
   * Stop existing background music.
   */
  stopMusic: function () {
    if (!this.context_) return;

    // disable current music
    if (this.currentMusic_) {
      this.currentMusic_.connector.noteOff(0);
      this.currentMusic_.connector.disconnect(0);
    }

    // remove meta data
    this.currentMusic_.connector = null;
    this.currentMusic_.id = null;
  },


  playLoadedMusic_: function (_, id) {
    controller.audio_playMusic(id);
    if (view.hasInfoMessage()) view.message_closePanel(1000);
  },

  storeAudio_: function (obj) {
    var audioData = Base64Helper.decodeBuffer(obj.value);
    controller.audio_loadByArrayBuffer(
      obj.key,
      audioData,
      this.playLoadedMusic_
    );
  },

  loadAudio: function (path, loadIt, callback) {
    if (cwt.Audio.isBuffered(path)) {
      return;
    }

    controller.storage_assets.get(path, function (obj) {
      if (obj) {

        // in the cache
        if (loadIt) {
          controller.storage_assets.get(path, function (obj) {
            cwt.assert(obj.value);

            var audioData = Base64Helper.decodeBuffer(obj.value);
            controller.audio_loadByArrayBuffer(path, audioData, function () {
              callback();
            });
          });
        } else {
          callback();
        }

      } else {

        // not in the cache
        var request = new XMLHttpRequest();

        request.open("GET", path, true);
        request.responseType = "arraybuffer";

        request.onload = function () {
          if (this.status === 404) {
            throw Error("could not find sound file " + path );
          }

          var audioData = request.response;
          var stringData = Base64Helper.encodeBuffer(audioData);

          controller.storage_assets.set(path, stringData, function () {
            if (loadIt) {
              cwt.Audio.loadByArrayBuffer(path, audioData, function () {
                callback();
              });
            } else {
              callback();
            }
          });
        };

        request.send();
      }
    });
  },

  /**
   * Loads a sound into the audio system
   */
  loadByArrayBuffer: function (id, audioData, callback) {
    cwt.assert(util.isString(id));

    if (this.DEBUG) util.log("decode audio aw2 of", id);

    controller.audio_grabContext().decodeAudioData(audioData,

      // success handling
      function (buffer) {
        controller.audio_registerAudioBuffer(id, buffer);
        if (callback) callback(true, id);
      },

      // error handling
      function (e) {
        if (callback) callback(false, id);
      }
    );
  },

  playCoMusic: function (id) {
    if (!id) {
      if (view.hasInfoMessage()) view.message_closePanel(1000);
      return;
    }

    if (!this.isBuffered(id)) {
      this.loadAudio_(id);
    } else {
      this.playLoadedMusic_(false, id);
    }
  }
};