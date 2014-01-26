/**
 * Holds some information about the current selection map.
 */
cwt.gameFlowData.selection = util.scoped(function () {
  
  var sMap = util.selectionMap(MAX_SELECTION_RANGE * 4 + 1);

  // Extension to the selection map. This one prepares the selection
  // for the current data model.
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

    // rerender data
    for (x = 0; x < e; x++) {
      for (y = 0; y < e; y++) {
        if (this.data[x + cx][y + cy] > INACTIVE_ID) view.redraw_markPos(x + cx, y + cy);
      }
    }
  };

  return sMap;
});

/**
 * The range of the selection cursor. Only needed in the free 
 * target selection screen.
 */
cwt.gameFlowData.selectionRange = INACTIVE_ID;