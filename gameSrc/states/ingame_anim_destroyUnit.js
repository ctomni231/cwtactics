"use strict";

var constants = require("../constants");
var renderer = require("../renderer");
var images = require("../image");
var debug = require("../debug");
var audio = require("../audio");

var EXPLODE_SOUND = "EXPLODE";
var EXPLODE_SPRITE = "EXPLOSION_GROUND";
var FRAMES = 9;

var TIME_PER_FRAME = 64;

var tx;
var ty;
var currentFrame;
var currentTime;

var explosionImg;

exports.state = {

  id: "ANIMATION_DESTROY_UNIT",
  nextState: "INGAME_IDLE",

  states: 2,

  enter: function(x, y) {
    tx = x - renderer.screenOffsetX;
    ty = y - renderer.screenOffsetY;

    currentTime = 0;
    currentFrame = 0;

    // lazy loadGameConfig explosion image
    if (!explosionImg) {
      explosionImg = images.sprites[EXPLODE_SPRITE];
      debug.assertTrue(explosionImg, "expected an explosion image after lazy loading [destroy unit animation]");
    }
  },

  exit: function() {
    renderer.layerUI.clear();
  },

  update: function(delta, lastInput, state) {
    switch (state) {

      // play destroy sound
      case 0:
        audio.playSound(EXPLODE_SOUND);
        return true;

        // render explosion
      case 1:
        currentTime += delta;
        if (currentTime >= TIME_PER_FRAME) {
          currentFrame += 1;
        }
        return (currentFrame >= FRAMES);
    }
  },

  render: function(delta, state) {
    renderer.layerUI.clear();
    var ctx = renderer.layerUI.getContext();

    ctx.drawImage(explosionImg, tx * constants.TILE_BASE, ty * constants.TILE_BASE);
  }
};