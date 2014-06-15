"use strict";

/**
 * Represents a given data set of an input call.
 *
 * @class
 */
cwt.InputData = my.Class({
  constructor: function () {
    this.resetStatus();
  },

  resetStatus: function () {
    this.key = -1;
    this.d1 = -1;
    this.d2 = -1;
  }
});

/**
 *
 * @class
 */
cwt.Input = {

  MAPPING_STORAGE_KEY: "__user_key_map__",

  // all input command types
  TYPE_LEFT: 1,
  TYPE_RIGHT: 2,
  TYPE_UP: 3,
  TYPE_DOWN: 4,
  TYPE_ACTION: 5,
  TYPE_CANCEL: 6,
  TYPE_HOVER: 7,
  TYPE_SET_INPUT: 8,

  /**
   * @type cwt.CircularBuffer<cwt.InputData>
   */
  stack: new cwt.CircularBuffer(10),

  /**
   * @type cwt.CircularBuffer<cwt.InputData>
   */
  pool: new cwt.CircularBuffer(10),

  types: {},

  /**
   * If true, then every user input will be blocked.
   */
  blocked: false,

  initialize: function () {
    cwt.Input.initialize = null;

    Object.keys(cwt.Input.types).forEach(function (inp) {
      cwt.Input.types[inp].factory();
    });

    // create data holder
    while (!this.pool.isFull()) {
      this.pool.push(new cwt.InputData());
    }
  },

  /**
   *
   */
  requestBlock: function () {
    this.blocked = true;
  },

  /**
   *
   */
  releaseBlock: function () {
    this.blocked = false;
  },

  genericInput: false,

  /**
   * Creates an input object. The factory function will be called directly after creating
   * the instance. Furthermore the created object will be inserted into cwt.Input as property
   * with the name given by the 'key' argument.
   *
   * @param key
   * @param factory
   */
  create: function (key, factory) {
    var obj = {};
    obj.factory = factory;
    this.types[key] = obj;
  },

  /**
   * Pushes an input key into the input stack. The parameters d1 and d2 has to be integers.
   *
   * @param {number} key
   * @param {number=} d1
   * @param {number=} d2
   */
  pushAction: function (key, d1, d2) {
    if (this.blocked || this.pool.isEmpty()) {
      return;
    }

    // convert undefined and null data arguments to the inactive code
    if (d1 !== 0 && !d1) {
      d1 = cwt.INACTIVE;
    }
    if (d2 !== 0 && !d2) {
      d2 = cwt.INACTIVE;
    }

    // push command into buffer
    var cmd = this.pool.popFirst();
    cmd.d1 = d1;
    cmd.d2 = d2;
    cmd.key = key;

    this.stack.push(cmd);
  },

  /**
   * Grabs an input key from the input stack. -1 if no key is in the stack.
   *
   * @returns {null|cwt.InputData}
   */
  popAction: function () {
    if (this.stack.isEmpty()) {
      return null;
    }
    return this.stack.popFirst();
  },

  /**
   * Saves the current active input mapping into the user storage.
   */
  saveKeyMapping: function () {
    cwt.Storage.generalStorage.set(
      this.MAPPING_STORAGE_KEY,
      // extract custom mapping
      {
        keyboard: this.types.keyboard.MAPPING,
        gamePad: this.types.gamePad.MAPPING
      },
      function () {
        if (cwt.DEBUG) {
          console.log("successfully saved user input mapping");
        }
      }
    );
  },

  /**
   * Loads the keyboard input mapping from the user storage. If no
   * user input setting will be found then the default mapping will
   * be used.
   *
   * @param cb
   */
  loadKeyMapping: function (cb) {
    cwt.Storage.generalStorage.get(
      this.MAPPING_STORAGE_KEY,
      function (obj) {
        if (obj && obj.value) {
          if (cwt.DEBUG) {
            console.log("loading custom key configuration");
          }

          // inject custom mapping
          if (obj.value.keyboard) {
            cwt.Input.types.keyboard.MAPPING = obj.value.keyboard;
          }
          if (obj.value.gamePad) {
            cwt.Input.types.gamePad.MAPPING = obj.value.gamePad;
          }
        }

        // call callback
        if (cb) {
          cb(obj != null);
        }
      }
    );
  },

  /**
   *
   * @param charCode
   * @return {String|null} Returns a string that represents the given keycode.
   */
  codeToChar: function (charCode) {
    if (charCode === -1) {
      return null;
    }

    var value = String.fromCharCode(charCode);
    switch (charCode) {
      case 6:
        value = "Mac";
        break;
      case 8:
        value = "Backspace";
        break;
      case 9:
        value = "Tab";
        break;
      case 13:
        value = "Enter";
        break;
      case 16:
        value = "Shift";
        break;
      case 17:
        value = "CTRL";
        break;
      case 18:
        value = "ALT";
        break;
      case 19:
        value = "Pause/Break";
        break;
      case 20:
        value = "Caps Lock";
        break;
      case 27:
        value = "ESC";
        break;
      case 32:
        value = "Space";
        break;
      case 33:
        value = "Page Up";
        break;
      case 34:
        value = "Page Down";
        break;
      case 35:
        value = "End";
        break;
      case 36:
        value = "Home";
        break;
      case 37:
        value = "Arrow Left";
        break;
      case 38:
        value = "Arrow Up";
        break;
      case 39:
        value = "Arrow Right";
        break;
      case 40:
        value = "Arrow Down";
        break;
      case 43:
        value = "Plus";
        break;
      case 45:
        value = "Insert";
        break;
      case 46:
        value = "Delete";
        break;
      case 91:
        value = "Left Window Key";
        break;
      case 92:
        value = "Right Window Key";
        break;
      case 93:
        value = "Select Key";
        break;
      case 96:
        value = "Numpad 0";
        break;
      case 97:
        value = "Numpad 1";
        break;
      case 98:
        value = "Numpad 2";
        break;
      case 99:
        value = "Numpad 3";
        break;
      case 100:
        value = "Numpad 4";
        break;
      case 101:
        value = "Numpad 5";
        break;
      case 102:
        value = "Numpad 6";
        break;
      case 103:
        value = "Numpad 7";
        break;
      case 104:
        value = "Numpad 8";
        break;
      case 105:
        value = "Numpad 9";
        break;
      case 106:
        value = "*";
        break;
      case 107:
        value = "+";
        break;
      case 109:
        value = "-";
        break;
      case 110:
        value = ";";
        break;
      case 111:
        value = "/";
        break;
      case 112:
        value = "F1";
        break;
      case 113:
        value = "F2";
        break;
      case 114:
        value = "F3";
        break;
      case 115:
        value = "F4";
        break;
      case 116:
        value = "F5";
        break;
      case 117:
        value = "F6";
        break;
      case 118:
        value = "F7";
        break;
      case 119:
        value = "F8";
        break;
      case 120:
        value = "F9";
        break;
      case 121:
        value = "F10";
        break;
      case 122:
        value = "F11";
        break;
      case 123:
        value = "F12";
        break;
      case 144:
        value = "Num Lock";
        break;
      case 145:
        value = "Scroll Lock";
        break;
      case 186:
        value = ";";
        break;
      case 187:
        value = "=";
        break;
      case 188:
        value = ",";
        break;
      case 189:
        value = "-";
        break;
      case 190:
        value = ".";
        break;
      case 191:
        value = "/";
        break;
      case 192:
        value = "`";
        break;
      case 219:
        value = "[";
        break;
      case 220:
        value = "\\";
        break;
      case 221:
        value = "]";
        break;
      case 222:
        value = "'";
        break;
    }

    return value;
  }
};

cwt.Input.create("gamePad", function () {

  // not supported ?
  if (!cwt.ClientFeatures.gamePad) {
    return;
  }

  var prevTimestamps = [];
  var that = this;

  that.MAPPING = {
    ACTION: 0,
    CANCEL: 1
  };

  this.update = function () {
    var gamePads = navigator.webkitGetGamepads();

    for (var i = 0, e = 4; i < e; i++) {
      var gamePad = gamePads[i];
      if (!gamePad) continue;

      // check_ timestamp
      if (prevTimestamps[i] && (gamePad.timestamp == prevTimestamps[i])) continue;
      prevTimestamps[i] = gamePad.timestamp;

      // in key mapping
      if (cwt.Input.genericInput) {
        if (cwt.Gameflow.activeState.mode != 1) {
          return;
        }

        var code = -1;

        // grab key code of the pressed button
        if (gamePad.elements[0] === 1) code = 0;
        else if (gamePad.elements[1] === 1) code = 1;
        else if (gamePad.elements[2] === 1) code = 2;
        else if (gamePad.elements[3] === 1) code = 3;
        else if (gamePad.elements[4] === 1) code = 4;
        else if (gamePad.elements[5] === 1) code = 5;
        else if (gamePad.elements[6] === 1) code = 6;
        else if (gamePad.elements[7] === 1) code = 7;
        else if (gamePad.elements[8] === 1) code = 8;
        else if (gamePad.elements[9] === 1) code = 9;
        else if (gamePad.elements[10] === 1) code = 10;
        else if (gamePad.elements[11] === 1) code = 11;
        else if (gamePad.elements[12] === 1) code = 12;
        else if (gamePad.elements[13] === 1) code = 13;

        if (code > -1) {
          cwt.Gameflow.activeState.genericInput(code);
        }
      } else {
        var key = null;

        // try to extract key
        if (gamePad.buttons[that.MAPPING.ACTION] === 1) {
          key = cwt.Input.TYPE_ACTION;

        } else if (gamePad.buttons[that.MAPPING.CANCEL] === 1) {
          key = cwt.Input.TYPE_CANCEL;

        } else if (gamePad.axes[1] < -0.5) {
          key = cwt.Input.TYPE_UP;

        } else if (gamePad.axes[1] > +0.5) {
          key = cwt.Input.TYPE_DOWN;

        } else if (gamePad.axes[0] < -0.5) {
          key = cwt.Input.TYPE_LEFT;

        } else if (gamePad.axes[0] > +0.5) {
          key = cwt.Input.TYPE_RIGHT;
        }

        // invoke input event when a known key was pressed
        if (key) {
          cwt.Input.pushAction(key, cwt.INACTIVE, cwt.INACTIVE);
        }
      }
    }
  }
});
cwt.Input.create("keyboard", function () {
  var that = this;

  var CONSOLE_TOGGLE_KEY = 192;

  // not supported ?
  if (!cwt.ClientFeatures.keyboard) {
    return;
  }

  that.MAPPING = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    ACTION: 13,
    CANCEL: 8
  };

  // register key down listener
  document.onkeydown = function (ev) {
    var key = cwt.INACTIVE;

    if (cwt.Input.genericInput) {
      if (cwt.Gameflow.activeState.mode != 0) {
        return;
      }

      cwt.Gameflow.activeState.genericInput(ev.keyCode);

    } else {

      // extract code
      switch (ev.keyCode) {

        case CONSOLE_TOGGLE_KEY:
          console.toggle();
          break;

        case that.MAPPING.LEFT:
          key = cwt.Input.TYPE_LEFT;
          break;

        case that.MAPPING.UP:
          key = cwt.Input.TYPE_UP;
          break;

        case that.MAPPING.RIGHT:
          key = cwt.Input.TYPE_RIGHT;
          break;

        case that.MAPPING.DOWN:
          key = cwt.Input.TYPE_DOWN;
          break;

        case that.MAPPING.CANCEL:
          key = cwt.Input.TYPE_CANCEL;
          break;

        case that.MAPPING.ACTION:
          key = cwt.Input.TYPE_ACTION;
          break;
      }

      // push key into input stack
      if (key !== cwt.INACTIVE) {
        cwt.Input.pushAction(key, cwt.INACTIVE, cwt.INACTIVE);
      }
    }
  };
});
cwt.Input.create("mouse", function () {

  // not supported ?
  if (!cwt.ClientFeatures.mouse) {
    return;
  }

  var canvas = document.getElementById("canvas_layer7");
  var sx = 1.0;
  var sy = 1.0;

  // register move listener
  canvas.onmousemove = function (ev) {
    var id = ev.target.id;

    var x, y;

    // extract real x,y position on the canvas
    ev = ev || window.event;
    if (typeof ev.offsetX === 'number') {
      x = ev.offsetX;
      y = ev.offsetY;
    }
    else {
      x = ev.layerX;
      y = ev.layerY;
    }

    var cw = canvas.width;
    var ch = canvas.height;

    // get the scale based on actual width;
    sx = cw / canvas.offsetWidth;
    sy = ch / canvas.offsetHeight;

    var data = cwt.Gameflow.activeState.data;
    if (data.inputMove) {
      data.inputMove(parseInt(x*sx),parseInt(y*sy));
    }


    // convert to a tile position
    /*
    x = cwt.Screen.offsetX + parseInt(x / cwt.Screen.TILE_BASE, 10);
    y = cwt.Screen.offsetY + parseInt(y / cwt.Screen.TILE_BASE, 10);

    if (x !== cwt.Cursor.x || y !== cwt.Cursor.y) {
      cwt.Input.pushAction(cwt.Input.TYPE_HOVER, x, y);
    }
    */
  };

  // register click listener
  canvas.onmouseup = function (ev) {
    var key = cwt.INACTIVE;

    // click on canvas while menu is open -> cancel always
    ev = ev || window.event;
    switch (ev.which) {

      // LEFT
      case 1:
        key = cwt.Input.TYPE_ACTION;
        break;

      // MIDDLE
      case 2:
        break;

      // RIGHT
      case 3:
        key = cwt.Input.TYPE_CANCEL;
        break;
    }

    // push command into the stack
    if (key !== cwt.INACTIVE) {
      cwt.Input.pushAction(key, cwt.INACTIVE, cwt.INACTIVE);
    }
  };

});
cwt.Input.create("touch", function () {

  // not supported ?
  if (!cwt.ClientFeatures.touch) {
    return;
  }

  var input = this;

  function inSelection() {
    var state = cwt.Gameflow.activeStateId;
    return (
      state === "INGAME_MOVEPATH"
        || state === "INGAME_SELECT_TILE_TYPE_A"
        || state === "INGAME_SELECT_TILE_TYPE_B" );
    // || controller.attackRangeVisible );
  }

  function inMenu() {
    var state = cwt.Gameflow.activeStateId;
    return (
      state === "INGAME_MENU"
        || state === "INGAME_SUBMENU" );
  }

  // ----------------------------------------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------------------------------

  // Called when an one finger tap occur
  //
  function oneFingerTap(event, x, y) {
    if (input.disabled) return;

    x = cwt.Screen.offsetX + parseInt(x / cwt.Screen.TILE_BASE, 10);
    y = cwt.Screen.offsetY + parseInt(y / cwt.Screen.TILE_BASE, 10);


    if (!inMenu()) {
      if (inSelection()) {
        if (cwt.Gameflow.globalData.selection.getValue(x, y) > 0) {
          cwt.Input.pushAction(cwt.Input.TYPE_ACTION, x, y);
        } else {
          cwt.Input.pushAction(cwt.Input.TYPE_CANCEL, x, y);
        }
      } else {
        cwt.Input.pushAction(cwt.Input.TYPE_ACTION, x, y);
      }

    } else {


      if (event.target.id === "cwt_menu") {
        cwt.Input.pushAction(cwt.Input.TYPE_ACTION, cwt.INACTIVE, cwt.INACTIVE);
      } else {
        cwt.Input.pushAction(cwt.Input.TYPE_CANCEL, cwt.INACTIVE, cwt.INACTIVE);
      }
    }
  }

  // Called when a two finger tap occur
  //
  function twoFingerTap(event, x, y) {
    cwt.Input.pushAction(cwt.Input.TYPE_CANCEL, cwt.INACTIVE, cwt.INACTIVE);
  }

  // Called when a swipe occur
  //
  // if dx is not 0 then dy is 0
  // if dy is not 0 then dx is 0
  //
  function swipe(event, dx, dy) {
    var key = null;

    if (dx === 1) key = cwt.Input.TYPE_RIGHT;
    if (dy === 1) key = cwt.Input.TYPE_DOWN;
    if (dx === -1) key = cwt.Input.TYPE_LEFT;
    if (dy === -1) key = cwt.Input.TYPE_UP;

    cwt.Input.pushAction(key, ( cwt.Gameflow.state === "GAME_ROUND" ) ? 10 : 1, cwt.INACTIVE);
  }

  // Called when a drag occur. A drag happens when a one finger tap occurs
  // and won't be released for a longer time. The drag happens when the
  // finger moves into one direction during the hold.
  //
  // if dx is not 0 then dy is 0
  // if dy is not 0 then dx is 0
  //
  function oneFingerDrag(event, dx, dy) {
    if (input.disabled) return;

    var key = null;

    if (dx === 1) key = cwt.Input.TYPE_RIGHT;
    if (dy === 1) key = cwt.Input.TYPE_DOWN;
    if (dx === -1) key = cwt.Input.TYPE_LEFT;
    if (dy === -1) key = cwt.Input.TYPE_UP;

    cwt.Input.pushAction(key, 1, cwt.INACTIVE);

    if (!inMenu()) {
      //ON THE

    } else {
      if (event.target.id === "cwt_menu") {
        //INSIDE THE MENU
        //MOVE SELECTION IN DIRECTION OF DRAG

      } else {
        //OUTSIDE THE MENU
        cwt.Input.pushAction(cwt.Input.TYPE_CANCEL, cwt.INACTIVE, cwt.INACTIVE);
      }
    }

  }

  // Called when a one finger tap is invoked and released after
  // a longer time ( >= 500ms )
  // the position of the finger is fixed in a hold ( at least the finger
  // does not really moved )
  //
  function holdOneFingerTap(event, x, y) {
    //OKAY FOR HOLD, this is tricky
    //Again separated for map and menu

    if (!inMenu()) {

      // IF ATTACK RANGE VISIBLE IN RANGE
      cwt.Input.pushAction(cwt.Input.TYPE_ACTION, x, y);

      //  OUTSIDE RANGE
      cwt.Input.pushAction(cwt.Input.TYPE_CANCEL, x, y);

      // IF ATTACK RANGE IS NOT  VISIBLE
      cwt.Input.pushAction(cwt.Input.TYPE_ACTION, x, y);

    } else {
      if (event.target.id === "cwt_menu") {
        // WHEN HOLD HAPPENS IN THE MENU THEN
        // SLOWLY MOVE DOWN OR UP THROUGH
        // OPTIONS IN DIRECTION OF DRAG...
      } else {
        // WHEN TAP HAPPENS OUTSIDE THE MENU
      }
    }
  }

  // Called when the user pinches
  // delta is not 0 and
  //   delta < 0 means pinch in
  //   delta > 0 means pinch out
  function pinch(event, delta) {
    //if (delta < 0) controller.setScreenScale(controller.screenScale - 1);
    //else           controller.setScreenScale(controller.screenScale + 1);
  }

  // ----------------------------------------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------------------------------

  // positions
  //  - first finger
  var sx, sy;
  var ex, ey;
  //  - second finger
  var s2x, s2y;
  var e2x, e2y;

  // timestamp
  var st;

  // PINCH VARS
  var pinDis, pinDis2;

  // DRAG VARS
  var dragDiff = 0;
  var isDrag = false;

  // TOUCH STARTS
  document.addEventListener('touchstart', function (event) {
    event.preventDefault();

    // SAVE POSITION AND CLEAR OLD DATA
    sx = event.touches[0].clientX;
    sy = event.touches[0].clientY;
    ex = sx;
    ey = sy;
    isDrag = false;

    // IF A SECOND FINGER IS ON THE SCREEN THEN REMEMBER ITS POSITION
    if (event.touches.length === 2) {

      // SAVE POSITION AND CLEAR OLD DATA
      s2x = event.touches[1].clientX;
      s2y = event.touches[1].clientY;
      e2x = s2x;
      e2y = s2y;

      // REMEMBER DISTANCE BETWEEN FIRST AND SECOND FINGER
      var dx = Math.abs(sx - s2x);
      var dy = Math.abs(sy - s2y);
      pinDis = Math.sqrt(dx * dx + dy * dy)

    } else s2x = -1;

    // REMEMBER TIME STAMP
    st = event.timeStamp;
  }, false);

  // TOUCH MOVES
  document.addEventListener('touchmove', function (event) {
    event.preventDefault();

    var dx, dy;
    ex = event.touches[0].clientX;
    ey = event.touches[0].clientY;

    // IF A SECOND FINGER IS ON THE SCREEN THEN REMEMBER ITS POSITION
    if (event.touches.length === 2) {

      // SAVE POSITION
      e2x = event.touches[1].clientX;
      e2y = event.touches[1].clientY;

      // REMEMBER NEW DISTANCE BETWEEN FIRST AND SECOND FINGER
      // TO BE ABLE TO CALCULATION A PINCH MOVE IF TOUCH END EVENT
      // WILL BE TRIGGERED
      dx = Math.abs(ex - e2x);
      dy = Math.abs(ey - e2y);
      pinDis2 = Math.sqrt(dx * dx + dy * dy)
    } else s2x = -1;

    dx = Math.abs(sx - ex);
    dy = Math.abs(sy - ey);
    var d = Math.sqrt(dx * dx + dy * dy);
    var timeDiff = event.timeStamp - st;

    if (d > 16) {

      if (timeDiff > 300) {

        isDrag = true;
        if (dragDiff > 75) {
          if (dx > dy) oneFingerDrag(event, (sx > ex) ? -1 : +1, 0);
          else         oneFingerDrag(event, 0, (sy > ey) ? -1 : +1);
          dragDiff = 0;
          sx = ex;
          sy = ey;
        } else {
          dragDiff += timeDiff;
        }
      }
    }
  }, false);

  // TOUCH END
  document.addEventListener('touchend', function (event) {
    event.preventDefault();

    // CALCULATE DISTANCE AND TIME GAP BETWEEN START AND END EVENT
    var dx = Math.abs(sx - ex);
    var dy = Math.abs(sy - ey);
    var d = Math.sqrt(dx * dx + dy * dy);
    var timeDiff = event.timeStamp - st;

    // IS IT A TWO PINCH GESTURE?
    if (s2x !== -1) {
      if (Math.abs(pinDis2 - pinDis) <= 32) {
        twoFingerTap(event, ex, ey);
      } else pinch(event, (pinDis2 < pinDis) ? 1 : -1);
      // controller.inputCoolDown = 500;
    } else {
      if (d <= 16) {
        if (timeDiff <= 500) oneFingerTap(event, ex, ey);
      } else if (timeDiff <= 300) {
        if (dx > dy) swipe(event, (sx > ex) ? -1 : +1, 0);
        else         swipe(event, 0, (sy > ey) ? -1 : +1);
      }
    }

  }, false);

});