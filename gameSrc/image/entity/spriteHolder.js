/**
 * Sprite namespace that holds all sprite objects.
 *
 * @namespace
 */
cwt.Sprites = {

  /** @constant */
  COLOR_NONE: -1,

  /** @constant */
  COLOR_RED: 0,

  /** @constant */
  COLOR_GREEN: 1,

  /** @constant */
  COLOR_BLUE: 2,

  /** @constant */
  COLOR_YELLOW: 3,

  /** @constant */
  COLOR_NEUTRAL: 4,

  /** @constant */
  COLOR_BLACK_MASK: 5,

  /**
   * All sprite objects.
   *
   * @type {Array.<cwt.Sprite|cwt.ColoredSprite>}
   * @private
   */
  sprites_: {},

  /**
   * All image objects.
   *
   * @private
   */
  images_: {},

  /**
   * Registers a sprite with given meta data.
   *
   * @param {String} key
   * @param {String} imgPath
   * @param {number} color
   * @param {number} offsetX
   * @param {number} offsetY
   */
  registerSprite: function (key, imgPath, color, offsetX, offsetY) {
    var image;

    // grab image
    if (!this.images_.hasOwnProperty(imgPath)) {

       // image is not loaded yet, load it now
    } else {
      if (color === this.COLOR_NONE) {
        image = this.images_[imgPath];
      } else {

        // colored
      }
    }

    var sprite = this.getSprite(key,this.COLOR_NONE);

    // set meta data
    sprite.offsetX = offsetX;
    sprite.offsetY = offsetY;
  },

  /**
   * Returns a sprite object for a key.
   *
   * @param {String} key
   */
  getSprite: function (key) {
    return this.sprites_[key];
  }

};