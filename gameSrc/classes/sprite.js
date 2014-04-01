/**
 * @class
 */
cwt.Sprite = my.Class({

  STATIC: {

    /**
     *
     * @param {cwt.Sprite} sprite
     * @return {Array}
     * @private
     */
    toJSON: function (sprite) {
      if (cwt.DEBUG) cwt.assert(sprite instanceof cwt.Sprite);

      var data = [];
      for (var i = 0, e = sprite.images.length; i < e; i++) {
        data[i] = Base64Helper.canvasToBase64(sprite.images[i]);
      }

      return data;
    },

    /**
     *
     * @param spriteData
     * @return {cwt.Sprite}
     * @private
     */
    fromJSON: function (spriteData) {
      var sprite = new cwt.Sprite();

      var data = sprite.images;
      for (var i = 0, e = sprite.images.length; i < e; i++) {
        var img = new Image();
        img.src = spriteData[i];
        data[i] = img;
      }

      return sprite;
    }
  },

  constructor: function () {
    this.images = [];
  },

  getImage: function (type) {
    return this.images[type];
  }
});