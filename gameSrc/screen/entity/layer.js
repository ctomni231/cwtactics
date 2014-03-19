/**
 *
 * @class
 */
cwt.ScreenLayer = my.Class(/** @lends cwt.Screen.Layer.prototype */ {

  constructor: function (frames, frameTime) {
    this.canvas = [];
    this.ctx = [];
    this.cFrame = 0;
    this.cTime = 0;
    this.frameLimit = frameTime;

    // create canvas objects
    var n = 0;
    while (n < frames) {
      this.canvas[n] = document.createElement("canvas");
      this.ctx[n] = this.canvas[n].getContext("2d");
      n++;
    }
  },

  /**
   * Returns the current active canvas of the layer.
   *
   * @return {HTMLCanvasElement}
   */
  getActiveFrame: function () {
    return this.canvas[this.cFrame];
  },

  /**
   * Returns the rendering context for a given frame id.
   *
   * @param {number=} frame
   * @return {CanvasRenderingContext2D}
   */
  getContext: function (frame) {
    if (arguments.length === 0) {
      frame = 0;
    }

    if (this.DEBUG) cwt.assert(frame >= 0 && frame < this.canvas.length);

    return this.ctx[frame];
  },

  /**
   * Updates the internal timer of the layer.
   *
   * @param delta
   */
  update: function (delta) {
    this.cTime += delta;

    // increase frame
    if (this.cTime >= this.frameLimit) {
      this.cTime = 0;
      this.cFrame++;

      // reset frame
      if (this.cFrame === this.canvas.length) {
        this.cFrame = 0;
      }
    }
  },

  /**
   * Resets timer and frame counter.
   */
  resetTimer: function () {
    this.cTime = 0;
    this.cFrame = 0;
  }

});