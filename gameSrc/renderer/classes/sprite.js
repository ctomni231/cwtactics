//
//
// @class
//
cwt.SpriteObject = my.Class({

  STATIC: {

    //
    //
    // @param {cwt.Sprite} sprite
    // @return {string}
    //
    toJSON: function(sprite) {
      if (cwt.DEBUG) cwt.assert(sprite instanceof cwt.Sprite);

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

      var sprite = new cwt.Sprite(spriteData.length);
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
    if (cwt.DEBUG) cwt.assert(index >= 0 && index < this.images.length);
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
