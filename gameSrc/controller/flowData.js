/**
 *
 * @type {{}}
 */
cwt.FlowData = {

  /**
   * Holds some information about the current action menu.
   *
   * @namespace
   */
  menu: {

    /**
     * Adds unload targets for a transporter at a given position to the menu.
     *
     * @param uid
     * @param x
     * @param y
     * @param menu
     */
    addUnloadTargetsToMenu: function (uid, x, y, menu) {
      var loader = model.unit_data[uid];
      var pid = loader.owner;
      var i = model.unit_firstUnitId(pid);
      var e = model.unit_lastUnitId(pid);
      var unit;

      for (; i <= e; i++) {
        unit = model.unit_data[i];

        if (unit.owner !== cwt.INACTIVE && unit.loadedIn === uid) {
          var movetp = model.data_movetypeSheets[ unit.type.movetype ];

          if (model.move_canTypeMoveTo(movetp, x - 1, y) ||
            model.move_canTypeMoveTo(movetp, x + 1, y) ||
            model.move_canTypeMoveTo(movetp, x, y - 1) ||
            model.move_canTypeMoveTo(movetp, x, y + 1)) menu.addEntry(i, true);
        }
      }
    }
  },



  selection: (function () {

    var sMap = new cwt.SelectionMap(cwt.MAX_MOVE_LENGTH * 4 + 1);

    // Extension to the selection map. This one prepares the selection
    // for the current aw2 model.
    //
    sMap.prepare = function () {
      var target = controller.stateMachine.data.target;
      var x = target.x;
      var y = target.y;

      this.setCenter(x, y, -1);

      var actObj = controller.stateMachine.data.action.object;
      actObj.prepareTargets(controller.stateMachine.data);

      // decide which selection mode will be used based on the given action object
      return (actObj.targetSelectionType === "A") ? "ACTION_SELECT_TARGET_A" :
        "ACTION_SELECT_TARGET_B";
    };

    //
    //
    sMap.rerenderNonInactive = function () {
      var e = this.data.length;
      var cx = this.centerX;
      var cy = this.centerY;

      // rerender aw2
      for (var x = 0; x < e; x++) {
        for (var y = 0; y < e; y++) {
          if (this.data[x + cx][y + cy] > cwt.INACTIVE) view.redraw_markPos(x + cx, y + cy);
        }
      }
    };

    return sMap;
  })(),

  addUnloadTargetsToSelection: function (uid, x, y, loadId, selection) {
    var loader = model.unit_data[uid];
    var movetp = model.data_movetypeSheets[ model.unit_data[ loadId ].type.movetype ];

    if (model.move_canTypeMoveTo(movetp, x - 1, y)) selection.setValueAt(x - 1, y, 1);
    if (model.move_canTypeMoveTo(movetp, x + 1, y)) selection.setValueAt(x + 1, y, 1);
    if (model.move_canTypeMoveTo(movetp, x, y - 1)) selection.setValueAt(x, y - 1, 1);
    if (model.move_canTypeMoveTo(movetp, x, y + 1)) selection.setValueAt(x, y + 1, 1);
  },

  selectionRange: cwt.INACTIVE

};