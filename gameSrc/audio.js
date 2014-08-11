"use strict";

var constants = require("./constants");
var features = require("./systemFeatures");
var storage = require("./storage");
var assert = require("./functions").assert;

var MUSIC_KEY = "MUSIC_";

// WebAudio context object.
//
var audioContext;

// Music audio node.
//
var musicNode = null;

// SFX audio node.
//
var sfxNode = null;

// if audio sfx and music is deactivated then do not initialize the audio context
if (features.audioSFX || features.audioMusic) {

  // construct new context
  if (window.AudioContext) {
    audioContext = new window.AudioContext();
  } else if (window.webkitAudioContext) {
    audioContext = new window.webkitAudioContext();
  }

  var createNode = (audioContext.createGainNode ? audioContext.createGainNode: audioContext.createGain);

  // construct audio nodes
  if (audioContext) {
    sfxNode = createNode.call(audioContext);
    sfxNode.gain.value = 1;
    sfxNode.connect(audioContext.destination);
    musicNode = createNode.call(audioContext);
    musicNode.gain.value = 0.5;
    musicNode.connect(audioContext.destination);
  }
}

var playSoundOnGainNode = function (gainNode, buffer, loop) {
  var source = audioContext.createBufferSource();

  // is loop enabled ?
  if (loop) {
    source.loop = true;
  }

  source.buffer = buffer;
  source.connect(gainNode);
  source.start(0);

  return source;
};

var musicLoadCb = function (obj) {
  if (constants.DEBUG) assert(obj.value);

  currentMusic.connector = playSoundOnGainNode(musicNode, Base64Helper.decodeBuffer(obj.value), true);
  currentMusic.inLoadProcess = false;
};

// Cache for audio buffers.
//
var buffer = {};

// Current played music object.
//
var currentMusic = {
  inLoadProcess: false,
  connector: null,
  id: null
};

exports.decodeAudio = function (arrayBuffer, successCb, errorCb) {
  audioContext.decodeAudioData(arrayBuffer,successCb,errorCb);
}

//
// Returns the value of the sfx audio node.
//
exports.getSfxVolume = function () {
  if (!audioContext) return;
  return sfxNode.gain.value;
};

//
// Returns the value of the music audio node.
//
exports.getMusicVolume = function () {
  if (!audioContext) return;
  return musicNode.gain.value;
};

//
// Sets the value of the sfx audio node.
//
exports.setSfxVolume = function (vol) {
  if (!audioContext) return;

  if (vol < 0) {
    vol = 0;
  } else if (vol > 1) {
    vol = 1;
  }

  sfxNode.gain.value = vol;
};

//
// Sets the value of the music audio node.
//
exports.setMusicVolume = function (vol) {
  if (!audioContext) return;

  if (vol < 0) {
    vol = 0;
  } else if (vol > 1) {
    vol = 1;
  }

  musicNode.gain.value = vol;
};

//
// Registers an audio buffer object.
//
// @param id
// @param buff
//
exports.registerAudioBuffer = function (id, buff) {
  if (constants.DEBUG) assert(!this.isBuffered(id));

  buffer[id] = buff;
};

//
// Removes a buffer from the cache.
//
exports.unloadBuffer = function (id) {
  if (constants.DEBUG) assert(this.isBuffered(id));

  delete buffer[id];
};

//
//
// @param id
// @return {boolean}
//
exports.isBuffered = function (id) {
  return buffer.hasOwnProperty(id);
};

//
// Plays an empty sound buffer. Useful to
// initialize the audio system.
//
exports.playNullSound = function () {
  if (!audioContext) return;

  var buffer = audioContext.createBuffer(1, 1, 22050);
  var source = audioContext.createBufferSource();

  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start(0);
};

//
// Plays a sound.
//
// @param {string} id id of the sound that will be played
// @param {boolean=} loop (default:false)
// @return {*}
//
exports.playSound = function (id, loop) {
  if (!audioContext) return null;
  if (constants.DEBUG) assert(buffer[id]);

  return playSoundOnGainNode(sfxNode, buffer[id], loop);
};

//
// Plays a background music.
//
// @param id id of the music object
//
exports.playMusic = function (id) {
  if (!audioContext || currentMusic.inLoadProcess) return false;

  // already playing this music ?
  if (currentMusic.id === id) {
    return;
  }

  // stop old music
  if (currentMusic.connector) {
    this.stopMusic();
  }

  // set meta data
  currentMusic.inLoadProcess = true;
  currentMusic.id = id;
  storage.get(MUSIC_KEY + id, musicLoadCb);

  return true;
};

//
// Stop existing background music.
//
exports.stopMusic = function () {
  if (!audioContext || currentMusic.inLoadProcess) return false;

  // disable current music
  if (currentMusic) {
    currentMusic.connector.noteOff(0);
    currentMusic.connector.disconnect(0);
  }

  // remove meta data
  currentMusic.connector = null;
  currentMusic.id = null;
  currentMusic.inLoadProcess = false;

  return true;
};
