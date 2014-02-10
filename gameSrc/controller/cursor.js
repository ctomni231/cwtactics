/**
 *
 * @namespace
 */
cwt.Cursor = {

  /**
   * X coordinate of the cursor.
   */
  x: 0,

  /**
   * Y coordinate of the cursor.
   */
  y: 0,

  reset: function () {
    this.x = 0;
    this.y = 0;
  },

  /**
   *
   * @param isCancel if true then it is a cancel action
   */
  action_: function (isCancel) {

    // BREAK IF YOU ARE IN THE ANIMATION PHASE
    if (controller.inAnimationHookPhase()) return;

    var bstate = controller.stateMachine.state;
    var bfocus = ( bstate === "MOVEPATH_SELECTION" ||
      bstate === "IDLE_R" ||
      bstate === "ACTION_SELECT_TARGET_A" ||
      bstate === "ACTION_SELECT_TARGET_B" );

    // INVOKE ACTION
    if (isCancel) {
      controller.stateMachine.event("cancel", controller.mapCursorX, controller.mapCursorY);
    }
    else {
      if (controller.menuVisible) {
        controller.stateMachine.event("action", controller.menu_getSelectedIndex());
      }
      else {
        controller.stateMachine.event("action", controller.mapCursorX, controller.mapCursorY);
      }
    }

    var astate = controller.stateMachine.state;
    var afocus = ( astate === "MOVEPATH_SELECTION" ||
      astate === "IDLE_R" ||
      astate === "ACTION_SELECT_TARGET_A" ||
      astate === "ACTION_SELECT_TARGET_B"  );

    // RERENDERING
    if (( bfocus && !afocus ) || afocus) {
      view.redraw_markSelection(controller.stateMachine.data);
    }

    // MENU
    if (astate === "ACTION_MENU" || astate === "ACTION_SUBMENU") {

      var menu = controller.stateMachine.data.menu;
      controller.showMenu(
        menu,
        controller.mapCursorX,
        controller.mapCursorY
      );
    }
    else {
      if (bstate === "ACTION_MENU" || bstate === "ACTION_SUBMENU") controller.hideMenu();
    }
  },

  /**
   *
   */
  actionCancel: function () {
    this.action_(true);
    controller.audio_playSound(model.data_sounds.CANCEL);
  },

  /**
   *
   */
  actionClick: function () {
    this.action_(false);
    controller.audio_playSound(model.data_sounds.MENUTICK);
  },

  /**
   * Moves the cursor into a given direction.
   *
   * @param dir
   * @param len
   */
  move: function (dir, len) {
    if (arguments.length === 1) len = 1;

    var x = this.x;
    var y = this.y;

    switch (dir) {

      case cwt.Move.MOVE_CODES_UP :
        y -= len;
        break;

      case cwt.Move.MOVE_CODES_RIGHT :
        x += len;
        break;

      case cwt.Move.MOVE_CODES_DOWN  :
        y += len;
        break;

      case cwt.Move.MOVE_CODES_LEFT  :
        x -= len;
        break;
    }

    this.setPosition(x, y);
  },

  /**
   * Moves the cursor to a given position. The view will be moved as well with
   * this function to make sure that the cursor is on the visible view.
   */
  setPosition: function (x, y, relativeToScreen, preventSound) {
    if (controller.isMenuOpen()) return;

    if (relativeToScreen) {
      x = x + this.x;
      y = y + this.y;
    }

    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x >= model.map_width) x = model.map_width - 1;
    if (y >= model.map_height) y = model.map_height - 1;

    if (x === controller.mapCursorX && y === controller.mapCursorY) return;

    // CLEAN OLD
    view.redraw_markPos(controller.mapCursorX, controller.mapCursorY);
    if (controller.mapCursorY < model.map_height - 1) view.redraw_markPos(controller.mapCursorX, controller.mapCursorY + 1);

    // in attack mode ?
    //  yes -> show damage
    var dmg = -1;
    var state = controller.stateMachine.state;
    if (state === "ACTION_SELECT_TARGET_A") {
      var data = controller.stateMachine.data;
      if (data.selection.getValueAt(x, y) > 0) {
        var targetUnit = model.unit_posData[x][y];
        if (targetUnit) {
          dmg = model.battle_getBattleDamageAgainst(
            data.source.unit,
            targetUnit,
            0,
            model.battle_canUseMainWeapon(
              data.source.unit,
              targetUnit
            ),
            false,
            data.source.x,
            data.source.y
          );
        }
      }
    }

    if (preventSound !== true) controller.audio_playSound(model.data_sounds.MAPTICK);
    view.redraw_markPos(controller.mapCursorX, controller.mapCursorY);

    controller.mapCursorX = x;
    controller.mapCursorY = y;

    controller.updateSimpleTileInformation(dmg);

    var scale = controller.screenScale;
    if (scale === 0) scale = 0.8;
    else if (scale === -1) scale = 0.7;

    var scw = parseInt(parseInt((window.innerWidth - 80) / 16, 10) / scale, 10);
    var sch = parseInt(parseInt((window.innerHeight - 80) / 16, 10) / scale, 10);

    // shift tile information panel if necessary
    if (controller.sideSimpleTileInformationPanel < 0 && (x - controller.screenX) < (scw * 0.25)) controller.moveSimpleTileInformationToRight();
    if (controller.sideSimpleTileInformationPanel > 0 && (x - controller.screenX) >= (scw * 0.75)) controller.moveSimpleTileInformationToLeft();

    // extract move code
    var moveCode = -1;
    if (x - controller.screenX <= 1)          moveCode = model.move_MOVE_CODES.LEFT;
    else if (x - controller.screenX >= scw - 1) moveCode = model.move_MOVE_CODES.RIGHT;
    else if (y - controller.screenY <= 1)     moveCode = model.move_MOVE_CODES.UP;
    else if (y - controller.screenY >= sch - 1) moveCode = model.move_MOVE_CODES.DOWN;

    // shift screen of you're reach a border
    if (moveCode !== -1) {
      controller.shiftScreenPosition(moveCode, 5);
    }

    view.redraw_markPos(x, y);
  }

};

