/**
 *
 * @type {{}}
 */
cwt.FlowData = {

  /**
   * Controls the type of click confirm.
   */
  fastClickMode: false,

  /** Position object ( instance of `cwt.Position` ) with
   * rich information about the selected position by an
   * action and some relations.
   */
  source: new cwt.Position(),

  /**
   * Position object ( instance of `cwt.Position` ) with
   * rich information about the selected position by an
   * action and some relations.
   */
  target: new cwt.Position(),

  /**
   * Position object ( instance of `cwt.Position` ) with
   * rich information about the selected position by an
   * action and some relations.
   */
  targetselection: new cwt.Position(),

  /**
   * Holds some information about the current selected action with the selected sub data.
   */
  action: {

    /**
     * Selected sub action object.
     */
    selectedEntry: null,

    /**
     * Selected sub action object.
     */
    selectedSubEntry: null,

    /**
     * Action object that represents the selected action.
     */
    object: null
  }

};