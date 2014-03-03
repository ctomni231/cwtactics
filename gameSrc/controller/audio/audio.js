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
   * Initializes the audio context.
   */
  initialize: function (p, b) {

    // if audio sfx and music is deactivated then do not initialize the audio context
    if (!controller.features_client.audioSFX && !controller.features_client.audioMusic) {
      return;
    }

    try {

      // construct new context
      if (window.AudioContext) {
        this.context_ = new window.AudioContext();
      } else if (window.webkitAudioContext) {
        this.context_ = new window.webkitAudioContext();
      } else throw Error("no AudioContext constructor found");

      // construct audio nodes
      this.gainNode_sfx_ = this.context_.createGainNode();
      this.gainNode_sfx_.gain.value = 1;
      this.gainNode_sfx_.connect(this.context_.destination);
      this.gainNode_music_ = this.context_.createGainNode();
      this.gainNode_music_.gain.value = 0.5;
      this.gainNode_music_.connect(this.context_.destination);

      // load volume from config
      controller.storage_general.get(this.SFX_STORAGE_PARAMETER, function (obj) {
        if (obj) this.gainNode_sfx_.gain.value = obj.value;
      });
      controller.storage_general.get(this.MUSIC_STORAGE_PARAMETER, function (obj) {
        if (obj) this.gainNode_music_.gain.value = obj.value;
      });
    }
    catch (e) {
      if (this.DEBUG) console.error("could not grab audio context (Error:", e, ")");
    }

    // remove initializer
    cwt.Audio.initialize = null;
  },

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
   * Returns a web audio context. If no context is initialized then it will be created first.
   */
  grabContext: function () {
    return controller.audio_ctx_;
  },

  buffer_: {},

  currentMusic_: null,

  currentMusicId_: null,

  registerAudioBuffer: function (id, buff) {
    if (this.DEBUG) util.log("register", id, "in the audio cache");

    controller.audio_buffer_[id] = buff;
  },

  /**
   * Loads a sound into the audio system
   */
  loadByArrayBuffer: function (id, audioData, callback) {
    assert(util.isString(id));

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

  /**
   * Removes a buffer from the cache.
   */
  unloadBuffer: function (id) {
    assert(util.isString(id));

    if (this.DEBUG) util.log("de-register", id, "from the audio cache");

    delete controller.audio_buffer_[id];
  },

  isBuffered: function (id) {
    return controller.audio_buffer_.hasOwnProperty(id);
  },

  /**
   * Returns the value of the sfx audio node.
   */
  getSfxVolume: function () {
    if (!controller.audio_ctx_) return;

    return controller.audio_gainNode_sfx_.gain.value;
  },

  /**
   * Returns the value of the music audio node.
   */
  getMusicVolume: function () {
    if (!controller.audio_ctx_) return;

    return controller.audio_gainNode_music_.gain.value;
  },

  /**
   * Sets the value of the sfx audio node.
   */
  setSfxVolume: function (vol) {
    if (!controller.audio_ctx_) return;

    if (vol < 0) vol = 0;
    else if (vol > 1) vol = 1;

    controller.audio_gainNode_sfx_.gain.value = vol;
  },

  /**
   * Sets the value of the music audio node.
   */
  setMusicVolume: function (vol) {
    if (!controller.audio_ctx_) return;

    if (vol < 0) vol = 0;
    else if (vol > 1) vol = 1;

    controller.audio_gainNode_music_.gain.value = vol;
  },

  /**
   * Saves the configurations for the audio output.
   */
  saveConfigs: function () {

    // sfx
    if (controller.audio_gainNode_sfx_) {
      controller.storage_general.set(
        controller.audio_SFX_STORAGE_PARAMETER,
        controller.audio_gainNode_sfx_.gain.value
      );
    }

    // music
    if (controller.audio_gainNode_music_) {
      controller.storage_general.set(
        controller.audio_MUSIC_STORAGE_PARAMETER,
        controller.audio_gainNode_music_.gain.value
      );
    }
  },

  /**
   * Plays a sound effect.
   */
  playSound: function (id, loop, isMusic) {
    if (!this.context_) return;

    // buffered ?
    if (!this.buffer_[id]) return;

    var gainNode = (isMusic) ? this.gainNode_music_ : this.gainNode_sfx_;
    var source = this.context_.createBufferSource();

    if (loop) source.loop = true;
    source.buffer = this.buffer_[id];
    source.connect(gainNode);
    source.noteOn(0);

    return source;
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
   * Plays a background music.
   */
  playMusic: function (id) {
    if (!this.context_) return;

    // already playing this music ?
    if (this.currentMusicId_ === id) return;

    // buffered ?
    if (!this.buffer_[id]) return;

    this.stopMusic();

    this.currentMusic_ = this.playSound(id, true, true);
    this.currentMusicId_ = id;
  },

  /**
   * Stop existing background music.
   */
  stopMusic: function () {

    // disable current music
    if (this.currentMusic_) {
      this.currentMusic_.noteOff(0);
      this.currentMusic_.disconnect(0);
    }

    this.currentMusic_ = null;
    this.currentMusicId_ = null;
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

  loadAudio_: function (key) {
    controller.storage_assets.get(
      key,
      this.storeAudio_
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