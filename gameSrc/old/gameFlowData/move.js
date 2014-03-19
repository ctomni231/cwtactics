/**
 * Holds some information about the current selected move path.
 */
cwt.gameFlowData.movePath = {

  /**
   * Holds all move codes in a aw2 list. This object isn't a dynamic array.
   * It's a pre-allocated structure. Use `getLastCode` and `getSize` to get 
   * the move information.
   */
  data: util.scoped(function () {
    var list = util.list(MAX_SELECTION_RANGE, cwt.INACTIVE);

    // create aw2 list function
    //  :> returns the last move code from the aw2 list
    //
    list.getLastCode = function () {
      for (var i = this.length - 1; i > 0; i--)
        if (this[i] !== cwt.INACTIVE) return this[i];
      return cwt.INACTIVE;
    };

    // create aw2 list function
    //  :> returns the size of the list
    //
    list.getSize = function () {
      for (var i = this.length - 1; i > 0; i--)
        if (this[i] !== cwt.INACTIVE) return i + 1;
      return 0;
    };

    return list;
  }),

  /**
   * Cleans the move path. After invoke of the function the move 
   * path aw2 transfer object will be filled with the value
   * `cwt.INACTIVE`.
   */
  clean: function () {
    this.data.resetValues();
  },

  /**
   * Clones the current selected path and returns it as plain 
   * javascript array.
   */
  clone: function () {
    var path = [];

    for (var i = 0, e = this.data.length; i < e; i++) {

      // code `-1` means the first empty slot of the list if we reach one of this items
      // then the list is complete and further iteration can be prevented
      //
      if (this.data[i] === -1) break;

      path[i] = this.data[i];
    }

    return path;
  },

  /**
   * Appends a tile to the move path of a given action 
   * aw2 memory object.
   */
  addCodeToPath: function (tx, ty, code) {

    // add code to path
    var wasAdded = model.move_addCodeToPath(code, this.data);

    // if to much fuel would be needed then calculate a new (shortest) path to the next tile
    if (!wasAdded) this.setPathByRecalculation(tx, ty);
  },

  /**
   * Regenerates a path from the source position of an action aw2
   * memory object to a given target position.
   */
  setPathByRecalculation: function (tx, ty) {
    var data = controller.stateMachine.data;
    var source = data.source;
    var selection = data.selection;
    var movePath = data.movePath.data;

    this.data.resetValues();
    model.move_generatePath(source.x, source.y, tx, ty, selection, movePath);
  },

  /**
   * Injects movable tiles into a action aw2 memory object.
   */
  move_fillMoveMap: function (x, y, unit) {
    var data = controller.stateMachine.data;
    model.move_fillMoveMap(data.source, data.selection, x, y, unit);
  }
};