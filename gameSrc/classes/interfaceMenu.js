/**
 * @interface
 * @template T
 */
cwt.InterfaceMenu = {

  /**
   * @return {number}
   */
  getSelectedIndex: cwt.emptyFunction,

  /**
   * @function
   * @param {number?} index
   * @return {T}
   */
  getContent: cwt.emptyFunction,

  /**
   * @function
   * @param {number?} index
   * @return {*}
   */
  isEnabled: cwt.emptyFunction,

  /**
   * @function
   * @return {number} number of entries in the menu
   */
  getSize: cwt.emptyFunction,

  /**
   *
   * @function
   */
  clean: cwt.emptyFunction,

  /**
   *
   * @function
   * @param {T} content
   * @param {boolean?} enabled
   */
  addEntry: cwt.emptyFunction
};