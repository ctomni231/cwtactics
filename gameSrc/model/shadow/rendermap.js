/**
 *
 * @namespace
 */
cwt.RenderMap = {

  UNIT_STATUS_LOADS:0,
  UNIT_STATUS_HIDDEN:1,
  UNIT_STATUS_CAPTURE:2,

  UNIT_STATUS_NO_AMMO:0,
  UNIT_STATUS_NO_FUEL:1,
  UNIT_STATUS_NO_FUELAMMO:2,

  UNIT_STATUS_NO_LV:0,
  UNIT_STATUS_I_LV:1,
  UNIT_STATUS_II_LV:2,
  UNIT_STATUS_V_LV:3,

  /**
   * @type {Array.<Image,HTMLCanvasElement>}
   */
  data: cwt.list( 3 * MAX_MAP_HEIGHT * MAX_MAP_WIDTH ),

  /**
   *
   */
  status: cwt.list( 4 * MAX_UNITS_PER_PLAYER * MAX_PLAYER ),

  /**
   *
   * @param x
   * @param y
   * @returns {number}
   * @private
   */
  getIndex_: function (x,y) {
    return cwt.Gameround.map.width*y*3 +x*3;
  },

  /**
   *
   * @param x
   * @param y
   * @param {Image|HTMLCanvasElement} img
   */
  setPropertyData: function (x,y,img) {
    this.data[this.getIndex_(x,y)+1] = img;
  },

  /**
   *
   * @param x
   * @param y
   * @param {Image|HTMLCanvasElement} img
   */
  setUnitData: function (x,y,img) {
    this.data[this.getIndex_(x,y)+2] = img;
  },

  /**
   *
   * @param x
   * @param y
   * @param {Image|HTMLCanvasElement} img
   */
  setTileData: function (x,y,img) {
    this.data[this.getIndex_(x,y)] = img;
  }
};