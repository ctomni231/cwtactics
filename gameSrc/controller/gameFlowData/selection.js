/**
 * Holds some information about the current selection map.
 */
cwt.gameFlowData.selection = util.scoped(function () {

  var sMap = util.selectionMap(MAX_SELECTION_RANGE * 4 + 1);

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
        if (this.data[x + cx][y + cy] > INACTIVE_ID) view.redraw_markPos(x + cx, y + cy);
      }
    }
  };

  return sMap;
});

/**
 * Adds unload targets for a transporter at a given position to the selection.
 *
 * @param uid
 * @param x
 * @param y
 * @param loadId
 * @param selection
 */
cwt.gameFlowData.addUnloadTargetsToSelection = function (uid, x, y, loadId, selection) {
  var loader = model.unit_data[uid];
  var movetp = model.data_movetypeSheets[ model.unit_data[ loadId ].type.movetype ];

  if (model.move_canTypeMoveTo(movetp, x - 1, y)) selection.setValueAt(x - 1, y, 1);
  if (model.move_canTypeMoveTo(movetp, x + 1, y)) selection.setValueAt(x + 1, y, 1);
  if (model.move_canTypeMoveTo(movetp, x, y - 1)) selection.setValueAt(x, y - 1, 1);
  if (model.move_canTypeMoveTo(movetp, x, y + 1)) selection.setValueAt(x, y + 1, 1);
}

/**
 * The range of the selection cursor. Only needed in the free
 * target selection screen.
 */
cwt.gameFlowData.selectionRange = INACTIVE_ID;