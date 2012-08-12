/**
 * Annotations used in the init method in cwt modules to easy set meta data of the
 * module and the module data.
 *
 * @namespace
 */
cwt.annotation = {

  /**
   * Dynamical injected at runtime.
   *
   * @type {string}
   * @private
   */
  _selectedMod: null,

  /**
   * Annotates a function as shared transaction. A shared
   * transaction must be atomic.
   *
   * @param fName
   */
  transaction: function( fName ){
    cwt.transaction.registerTransaction( this._selectedMod, fName );
  },

  /**
   * Annotates an action as user action that will be shown in the
   * user menus.
   *
   * @param fName
   * @param checkCb the check function, that adds the single actions to
   *                the action list
   */
  userAction: function( fName, checkCb ){
    cwt.action.registerAction( this._selectedMod, fName, checkCb );
  },

  tagLaunchable: function(){
    // TODO
    throw Error("not implemented yet");
  },

  /**
   * Annotates a property as persistable part of a save game.
   *
   * @param fName
   */
  persist: function( fName ){
    cwt.persist.registerProperty( this._selectedMod, fName );
  }
};