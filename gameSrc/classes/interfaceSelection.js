/**
 * @interface
 */
cwt.InterfaceSelection = {

  /**
   *
   * @function
   * @return {Array.<Array<number>>}
   */
  getData: cwt.emptyFunction,

  /**
   *
   * @function
   * @return {number}
   */
  getCenterY: cwt.emptyFunction,

  /**
   *
   * @function
   * @return {number}
   */
  getCenterX: cwt.emptyFunction,

  /**
   *
   * @function
   * @param {number} x
   * @param {number} y
   * @param {number} defValue
   */
  setCenter: cwt.emptyFunction,

  /**
   *
   * @function
   * @param {number} x
   * @param {number} y
   */
  getValue: cwt.emptyFunction,

  /**
   *
   * @function
   * @param {number} x
   * @param {number} y
   * @param {number} value
   */
  setValue: cwt.emptyFunction
};