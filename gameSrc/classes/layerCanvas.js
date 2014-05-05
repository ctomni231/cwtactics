/**
 *
 * @class
 */
cwt.LayeredCanvas = my.Class({

  constructor: function (canvasId, frames, w, h) {

    // root canvas
    this.cv = document.getElementById(canvasId);
    this.cv.width = w;
    this.cv.height = h;
    this.ctx = this.cv.getContext("2d");
    this.w = w;
    this.h = h;

    // cached layers
    if (frames > 0) {
      this.contexts = [];
      this.layers = [];

      var n = 0;
      while (n < frames) {
        var cv = document.createElement("canvas");

        cv.width = w;
        cv.height = h;

        this.contexts[n] = cv.getContext("2d");
        this.layers[n] = cv;

        n++;
      }
    }
  },

  /**
   *
   * @param {Number} index
   */
  renderLayer: function (index) {
    if (cwt.DEBUG) cwt.assert(arguments.length === 0 || (index >= 0 && index < this.layers.length));

    var ctx = this.getContext();
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.drawImage(this.getLayer(index), 0, 0, this.w, this.h);
  },

  /**
   *
   * @param {Number?} index
   * @return {HTMLCanvasElement}
   */
  getLayer: function (index) {
    if (cwt.DEBUG) cwt.assert(index === void 0 || (index >= 0 && index < this.layers.length));

    // root ?
    if (index === void 0) {
      return this.cv;
    }

    return this.layers[index];
  },

  /**
   *
   * @param {Number?} index
   */
  clear: function (index) {
    this.getContext(index).clearRect(0, 0, this.w, this.h);
  },

  /**
   *
   * @param {Number?} index
   * @return {CanvasRenderingContext2D}
   */
  getContext: function (index) {
    if (cwt.DEBUG) cwt.assert(index === void 0 || (index >= 0 && index < this.layers.length));

    // root ?
    if (index === void 0) {
      return this.ctx;
    }

    return this.contexts[index];
  }
});