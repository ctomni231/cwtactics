"use strict";

var constants = require("./constants");

exports.TYPE_UNIT = 0;

//
//
exports.TYPE_PROPERTY = 1;

//
//
exports.TYPE_TILE = 2;

//
//
exports.TYPE_ANIMATED_TILE = 3;

//
//
exports.TYPE_ANIMATED_TILE_WITH_VARIANTS = 4;

//
//
exports.TYPE_MISC = 10;

//
//
exports.TYPE_IMAGE = 99;

// Color schema for a unit sprite.
//
exports.UNIT_INDEXES = {
  RED: 0,
  BLUE: 3,
  GREEN: 4,
  YELLOW: 5,
  colors: 6
};

// Color schema for a property sprite.
//
exports.PROPERTY_INDEXES = {
  RED: 0,
  GRAY: 1,
  BLUE: 3,
  GREEN: 4,
  YELLOW: 5,
  colors: 4
};

//
//
// @class
//
exports.Sprite = my.Class({

  STATIC: {

    // ---------------------------------------------

    // @constant */
    MINIMAP_2x2: 0,

    // @constant */
    MINIMAP_4x4: 1,

    // ---------------------------------------------

    // @constant */
    UNIT_STATES: 30,

    // @constant */
    UNIT_RED: 0,

    // @constant */
    UNIT_BLUE: 6,

    // @constant */
    UNIT_GREEN: 12,

    // @constant */
    UNIT_YELLOW: 18,

    // @constant */
    UNIT_SHADOW_MASK: 24,

    // @constant */
    UNIT_STATE_IDLE: 0,

    // @constant */
    UNIT_STATE_IDLE_INVERTED: 1,

    // @constant */
    UNIT_STATE_LEFT: 2,

    // @constant */
    UNIT_STATE_RIGHT: 3,

    // @constant */
    UNIT_STATE_UP: 4,

    // @constant */
    UNIT_STATE_DOWN: 5,

    // ---------------------------------------------

    // @constant */
    TILE_STATES: 2,

    // @constant */
    TILE_SHADOW: 1,

    // ---------------------------------------------

    // @constant */
    PROPERTY_STATES: 6,

    // @constant */
    PROPERTY_RED: 0,

    // @constant */
    PROPERTY_BLUE: 1,

    // @constant */
    PROPERTY_GREEN: 2,

    // @constant */
    PROPERTY_YELLOW: 3,

    // @constant */
    PROPERTY_NEUTRAL: 4,

    // @constant */
    PROPERTY_SHADOW_MASK: 5,

    // ---------------------------------------------

    // @constant */
    SYMBOL_HP: 0,

    // @constant */
    SYMBOL_AMMO: 1,

    // @constant */
    SYMBOL_FUEL: 2,

    // @constant */
    SYMBOL_LOAD: 3,

    // @constant */
    SYMBOL_CAPTURE: 4,

    // @constant */
    SYMBOL_ATT: 5,

    // @constant */
    SYMBOL_VISION: 6,

    // @constant */
    SYMBOL_MOVE: 7,

    // @constant */
    SYMBOL_UNKNOWN: 8,

    // @constant */
    SYMBOL_HIDDEN: 9,

    // @constant */
    SYMBOL_DEFENSE: 10,

    // @constant */
    SYMBOL_RANK_1: 11,

    // @constant */
    SYMBOL_RANK_2: 12,

    // @constant */
    SYMBOL_RANK_3: 13,

    // ---------------------------------------------

    // @constant */
    DIRECTION_N: 0,

    // @constant */
    DIRECTION_S: 1,

    // @constant */
    DIRECTION_W: 2,

    // @constant */
    DIRECTION_E: 3,

    // @constant */
    DIRECTION_SW: 4,

    // @constant */
    DIRECTION_SE: 5,

    // @constant */
    DIRECTION_NW: 6,

    // @constant */
    DIRECTION_NE: 7,

    // @constant */
    DIRECTION_NS: 8,

    // @constant */
    DIRECTION_WE: 9,

    // @constant */
    DIRECTION_ALL: 8,

    // @constant */
    DIRECTION_UP: 0,

    // @constant */
    DIRECTION_DOWN: 1,

    // @constant */
    DIRECTION_LEFT: 2,

    // @constant */
    DIRECTION_RIGHT: 3,

    // ---------------------------------------------

    // @constant */
    FOCUS_MOVE: 0,

    // @constant */
    FOCUS_ATTACK: 1,

    // ---------------------------------------------

    // @constant */
    COLOR_MAP_PROPERTY: 0,

    // @constant */
    COLOR_MAP_UNIT: 1,

    // ---------------------------------------------

    // @constant */
    EXPLOSION_GROUND: 0,

    // @constant */
    EXPLOSION_AIR: 1,

    // @constant */
    EXPLOSION_DUST: 2,

    // @constant */
    EXPLOSION_SEA: 3,

    // ---------------------------------------------

    //
    //
    // @param {cwt.Sprite} sprite
    // @return {string}
    //
    toJSON: function(sprite) {
      if (constants.DEBUG) assert(sprite instanceof exports.Sprite);

      var data = [];
      for (var i = 0, e = sprite.images.length; i < e; i++) {
        data[i] = Base64Helper.canvasToBase64(sprite.images[i]);
      }

      return JSON.stringify(data);
    },

    //
    // Loads a sprite from the cache.
    //
    // @param spriteData
    // @return {cwt.Sprite}
    //
    fromJSON: function(spriteData) {
      if (typeof spriteData === "string") {
        spriteData = JSON.parse(spriteData);
      }

      var sprite = new exports.Sprite(spriteData.length);
      var data = sprite.images;
      for (var i = 0, e = spriteData.length; i < e; i++) {
        data[i] = Base64Helper.base64ToImage(spriteData[i]);
      }

      return sprite;
    }
  },

  constructor: function(indexes) {
    this.images = [];

    while (indexes > 0) {
      this.images.push(null);
      indexes--;
    }
  },

  //
  //
  // @return {Number}
  //
  getNumberOfImages: function() {
    return this.images.length;
  },

  //
  //
  // @param {number} index
  // @param {HTMLImageElement|HTMLCanvasElement} image
  //
  setImage: function(index, image) {
    if (constants.DEBUG) assert(index >= 0 && index < this.images.length);
    this.images[index] = image;
  },

  //
  //
  // @param index
  // @return {HTMLImageElement|HTMLCanvasElement}
  //
  getImage: function(index) {
    return this.images[index];
  }
});

exports.sprites = {};

exports.overlayTiles = {};

exports.longAnimatedTiles = {};

exports.minimapIndex = {};