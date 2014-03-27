/**
 * Sprite class that holds all colored images of a type and its meta data.
 *
 * @class
 * @extends cwt.Sprite
 */
cwt.ArmySprite = my.Class({

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