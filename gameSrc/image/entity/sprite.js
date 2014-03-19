/**
 * Sprite class that holds an image of a type and its meta data.
 *
 * @class
 */
cwt.Sprite = my.Class({
  constructor: function () {
    this.img = null;
    this.ox = 0;
    this.oy = 0;
    this.overlay = false;
    this.animated = false;
  }
});

/**
 * Sprite class that holds all colored images of a type and its meta data.
 *
 * @class
 */
cwt.ColoredSprite = my.Class({
  constructor: function () {
    this.ox = 0;
    this.oy = 0;
    this.overlay = false;
    this.animated = false;
    this.colors = [
      null,
      null,
      null,
      null,
      null,
      null
    ];
  }
});