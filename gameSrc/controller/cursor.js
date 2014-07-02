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

  /**
   *
   */
  reset: function () {
    this.x = 0;
    this.y = 0;
  },

  /**
   * Moves the cursor into a given direction.
   *
   * @param {number} dir
   */
  move: function (dir) {
    var len = 1;
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
  setPosition: function (x, y, relativeToScreen) {
    if (relativeToScreen) {
      x = x + cwt.Screen.offsetX;
      y = y + cwt.Screen.offsetY;
    }

    // change illegal positions to prevent out of bounds
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x >= cwt.Map.width) x = cwt.Map.width - 1;
    if (y >= cwt.Map.height) y = cwt.Map.height - 1;

    if (x === this.x && y === this.y) {
      return;
    }

    cwt.MapRenderer.eraseCursor();

    this.x = x;
    this.y = y;

    // convert to screen relative pos
    x = x - cwt.Screen.offsetX;
    y = y - cwt.Screen.offsetY;

    // do possible screen shift
    var moveCode = cwt.INACTIVE;
    if (x <= 3) {
      moveCode = cwt.Move.MOVE_CODES_RIGHT;
      if (cwt.Screen.shiftScreen(moveCode)) {
        cwt.MapRenderer.shiftMap(moveCode);
      }

    }

    // do possible screen shift
    if (x >= cwt.SCREEN_WIDTH - 3) {
      moveCode = cwt.Move.MOVE_CODES_LEFT;
      if (cwt.Screen.shiftScreen(moveCode)) {
        cwt.MapRenderer.shiftMap(moveCode);
      }
    }

    // do possible screen shift
    if (y <= 3) {
      moveCode = cwt.Move.MOVE_CODES_DOWN;
      if (cwt.Screen.shiftScreen(moveCode)) {
        cwt.MapRenderer.shiftMap(moveCode);
      }

    }

    // do possible screen shift
    if (y >= cwt.SCREEN_HEIGHT - 3) {
      moveCode = cwt.Move.MOVE_CODES_UP;
      if (cwt.Screen.shiftScreen(moveCode)) {
        cwt.MapRenderer.shiftMap(moveCode);
      }
    }

    cwt.MapRenderer.renderCursor();
  },

  showNativeCursor: function () {
    cwt.Screen.layerUI.getLayer().style.cursor = "";
  },

  hideNativeCursor: function () {
    cwt.Screen.layerUI.getLayer().style.cursor = "none";
  }

};

