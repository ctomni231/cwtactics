/**
 *
 * @namespace
 */
cwt.Screen = {

  /**
   *
   * @class
   */
  Layer: my.Class(/** @lends cwt.Screen.Layer.prototype */ {

    constructor: function (frames, frameTime) {
      this.canvas = [];
      this.ctx = [];
      this.cFrame = 0;
      this.cTime = 0;
      this.frameLimit = frameTime;
    },

    getActiveFrame: function () {
      return this.canvas[this.cFrame];
    },

    getContext: function (frame) {
      if (DEBUG) assert(frame >= 0 && frame < this.canvas.length);

      return this.canvas[frame];
    },

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

    resetTimer: function () {
      this.cTime = 0;
      this.cFrame = 0;
    }

  }),

  /**
   * Tile size base.
   */
  TILE_BASE: 16,

  /**
   * Number of tiles in a row in the screen.
   */
  MAX_TILES_W: 20,

  /**
   * Number of tiles in a column in the screen.
   */
  MAX_TILES_H: 15,

  UNIT_ANIM_TIME: 150,

  UNIT_ANIM_STEP: 3,

  TILE_ANIM_TIME: 300,

  TILE_ANIM_STEP: 8,

  ONE_FRAME_ANIM_TIME: 9999,

  ONE_FRAME_ANIM_STEP: 1,

  layer1_bg: null,

  layer2_tiles: null,

  layer3_fog: null,

  layer4_unit: null,

  layer5_weather: null,

  layer6_ui: null,

  initialize: function () {
    var width = this.TILE_BASE * this.MAX_TILES_W;
    var height = this.TILE_BASE * this.MAX_TILES_H;

    this.layer1_bg = new this.Layer(this.ONE_FRAME_ANIM_STEP, this.ONE_FRAME_ANIM_TIME);
    this.layer2_tiles = new this.Layer(this.TILE_ANIM_STEP, this.TILE_ANIM_TIME);
    this.layer3_fog = new this.Layer(this.ONE_FRAME_ANIM_STEP, this.ONE_FRAME_ANIM_TIME);
    this.layer4_unit = new this.Layer(this.UNIT_ANIM_STEP, this.UNIT_ANIM_TIME);
    this.layer5_weather = new this.Layer(this.ONE_FRAME_ANIM_STEP, this.ONE_FRAME_ANIM_TIME);
    this.layer6_ui = new this.Layer(this.ONE_FRAME_ANIM_STEP, this.ONE_FRAME_ANIM_TIME);
  }

};