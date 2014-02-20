/**
 *
 * @namespace
 */
cwt.Screen = {

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

  layer1Canvas: document.getElementById("X"),

  layer1Ctx: document.getElementById("X").getContext("2d"),

  layer2Canvas: document.getElementById("X"),

  layer2Ctx: document.getElementById("X").getContext("2d"),

  layer3Canvas: document.getElementById("X"),

  layer3Ctx: document.getElementById("X").getContext("2d"),

  layer4Canvas: document.getElementById("X"),

  layer4Ctx: document.getElementById("X").getContext("2d"),

  /**
   *
   * @param canvas
   * @private
   */
  calcCanvasSize_: function (canvas) {
    canvas.width = this.TILE_BASE * this.MAX_TILES_W;
    canvas.height = this.TILE_BASE * this.MAX_TILES_H;
  },

  initialize: function () {
    this.calcCanvasSize_(this.layer1Canvas);
    this.calcCanvasSize_(this.layer2Canvas);
    this.calcCanvasSize_(this.layer3Canvas);
    this.calcCanvasSize_(this.layer4Canvas);
  }

};