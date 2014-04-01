/**
 * Sprite class that holds all colored images of a type and its meta data.
 *
 * @class
 * @extends cwt.Sprite
 */
cwt.ArmySprite = my.Class({

  STATIC: {

    /**
     *
     * @param spriteData
     * @return {cwt.ArmySprite}
     * @private
     */
    fromJSON: function (spriteData) {
      var sprite = new cwt.ArmySprite();

      var data = sprite.images;
      for (var i = 0, e = sprite.colors.length; i < e; i++) {
        sprite.colors[i] = cwt.Sprite.fromJSON(spriteData[i]);
      }

      return sprite;
    },

    /**
     *
     * @param {cwt.ArmySprite} sprite
     * @return {Array}
     * @private
     */
    toJSON: function (sprite) {
      if (cwt.DEBUG) cwt.assert(sprite instanceof cwt.ArmySprite);

      var data = [];
      for (var i = 0, e = sprite.colors.length; i < e; i++) {
        data[i] = cwt.Sprite.toJSON(sprite.colors[i]);
      }

      return data;
    }
  },

  constructor: function () {
    this.colors = [];
  },

  /**
   *
   * @param color
   * @return {cwt.Sprite}
   */
  getSpriteForColor: function (color) {
    return this.colors[color];
  }
});