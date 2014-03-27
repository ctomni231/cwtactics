/**
 * Screen model.
 *
 * @namespace
 */
cwt.Screen = {

  /**
   * Tile size base.
   *
   * @constant
   */
  TILE_BASE: 16,

  /**
   * Number of tiles in a row in the screen.
   *
   * @constant
   */
  MAX_TILES_W: 20,

  /**
   * Number of tiles in a column in the screen.
   *
   * @constant
   */
  MAX_TILES_H: 15,

  canvas_width: 0,

  canvas_height: 0,

  /**
   * Steps for a unit animation step.
   *
   * @constant
   */
  UNIT_ANIM_TIME: 150,

  /**
   * Steps for a unit animation.
   *
   * @constant
   */
  UNIT_ANIM_STEP: 3,

  /**
   * Time for a tile/property animation step.
   *
   * @constant
   */
  TILE_ANIM_TIME: 300,

  /**
   * Steps for a tile/property animation.
   *
   * @constant
   */
  TILE_ANIM_STEP: 8,

  /**
   * Animation time for a one frame layer.
   *
   * @constant
   */
  ONE_FRAME_ANIM_TIME: 9999,

  /**
   * Steps for a one frame layer.
   *
   * @constant
   */
  ONE_FRAME_ANIM_STEP: 1,

  offsetX : 0,

  offsetY : 0,

  /**
   * Layer #1: Background behind all other layers
   *
   * @type {cwt.ScreenLayer}
   */
  backgroundLayer: new cwt.ScreenLayer(this.ONE_FRAME_ANIM_STEP, this.ONE_FRAME_ANIM_TIME),

  /**
   * Layer #2
   *
   * @type {cwt.ScreenLayer}
   */
  mapLayer: new cwt.ScreenLayer(this.TILE_ANIM_STEP, this.TILE_ANIM_TIME),

  /**
   * Layer #3
   *
   * @type {cwt.ScreenLayer}
   */
  fogLayer: new cwt.ScreenLayer(this.ONE_FRAME_ANIM_STEP, this.ONE_FRAME_ANIM_TIME),

  /**
   * Layer #4
   *
   * @type {cwt.ScreenLayer}
   */
  unitLayer: new cwt.ScreenLayer(this.UNIT_ANIM_STEP, this.UNIT_ANIM_TIME),

  /**
   * Layer #5
   *
   * @type {cwt.ScreenLayer}
   */
  weatherLayer: new cwt.ScreenLayer(this.ONE_FRAME_ANIM_STEP, this.ONE_FRAME_ANIM_TIME),

  /**
   * Layer #6: Front layer
   *
   * @type {cwt.ScreenLayer}
   */
  interfaceLayer: new cwt.ScreenLayer(this.ONE_FRAME_ANIM_STEP, this.ONE_FRAME_ANIM_TIME)

};