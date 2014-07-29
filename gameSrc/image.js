var constants = require("./constants");
var assert = require("./functions").assert;

//
//
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