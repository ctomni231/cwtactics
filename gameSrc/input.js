"use strict";

/**
 *
 * @module
 */

var circBuff = require("./system/circularBuffer");
var constants = require("./constants");
var state = require('./statemachine');
var renderer = require("./renderer");
var stateData = require('./states');
var system = require("./utility");
var debug = require("./debug");

var canvas = document.getElementById("canvas_layer_UI");
var sx = 1.0;
var sy = 1.0;

var CONSOLE_TOGGLE_KEY = 192;

var KEYBOARD_MAPPING = exports.KEYBOARD_MAPPING = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    ACTION: 13,
    CANCEL: 8
};

var GAMEPAD_MAPPING = exports.GAMEPAD_MAPPING = {
    ACTION: 0,
    CANCEL: 1
};

// all input command types
exports.TYPE_LEFT = 1;
exports.TYPE_RIGHT = 2;
exports.TYPE_UP = 3;
exports.TYPE_DOWN = 4;
exports.TYPE_ACTION = 5;
exports.TYPE_CANCEL = 6;
exports.TYPE_HOVER = 7;
exports.TYPE_SET_INPUT = 8;

/**
 *
 * @constructor
 */
var InputData = exports.InputData = utility.Structure({
    constructor: function () {
        this.reset();
    },

    /**
     * Resets the object data to a fresh state (no saved information).
     */
    reset: function () {
        this.key = constants.INACTIVE;
        this.d1 = constants.INACTIVE;
        this.d2 = constants.INACTIVE;
    }
});

/**
 *
 * @param mapping
 * @param enableFn
 * @param disableFn
 * @constructor
 */
var InputBackend = utility.Structure({
    constructor: function (mapping, enableFn, disableFn) {
        if (typeof enableFn !== "function" || typeof disableFn !== "function") {
            debug.logCritical("BadImplementationException: input backend");
        }

        this.enable = enableFn;
        this.disable = enableFn;
        this.mapping = mapping;
    }
});

var stack = new circBuff.CircularBuffer(10);

var pool = circBuff.createBufferByClass(exports.InputData, 10);

// If true, then every user input will be blocked.
var blocked = false;

exports.genericInput = false;

// Returns **true** when the input system wants a generic input (raw codes) from input backends like
// keyboards and game pads.
//
exports.wantsGenericInput = function () {
    return exports.genericInput;
};

/**
 * Requests an input block. All further input calls will be dropped
 * after calling this.
 */
exports.requestBlock = function () {
    blocked = true;
};

/**
 * Releases an input block. Input calls will be registered in the game
 * machine after calling this.
 */
exports.releaseBlock = function () {
    blocked = false;
};

/**
 * Pushes an input **key** into the input stack. The parameters **d1**
 * and **d2** has to be integers.
 *
 * @param key
 * @param d1
 * @param d2
 */
exports.pushAction = function (key, d1, d2) {
    if (blocked || pool.isEmpty()) {
        return;
    }

    if (constants.DEBUG) console.log("adding input data " + key + ", " + d1 + ", " + d2);

    // convert undefined and null data arguments to the inactive code
    if (d1 !== 0 && !d1) {
        d1 = constants.INACTIVE;
    }
    if (d2 !== 0 && !d2) {
        d2 = constants.INACTIVE;
    }

    // push command into buffer
    var cmd = pool.popFirst();
    cmd.d1 = d1;
    cmd.d2 = d2;
    cmd.key = key;

    stack.push(cmd);
};

// Grabs and returns an **input data object** from the input stack, **null** if the stack is empty.
//
exports.popAction = function () {
    if (stack.isEmpty()) {
        return null;
    }
    return stack.popFirst();
};

exports.releaseAction = function (inp) {
    pool.push(inp);
};

// Returns the character for a key code.
//
exports.codeToChar = function (charCode) {
    if (charCode === constants.INACTIVE) {
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
};

var keyboardHandler = function (ev) {
    var key = constants.INACTIVE;

    if (exports.wantsGenericInput()) {
        if (state.activeState.mode !== 0) return;

        // TODO
        state.activeState.genericInput(ev.keyCode);

    } else {

        // extract code
        switch (ev.keyCode) {

            case CONSOLE_TOGGLE_KEY:
                debug.logWarn("DebugConsoleNotImplemented");
                break;

            case KEYBOARD_MAPPING.LEFT:
                key = exports.TYPE_LEFT;
                break;

            case KEYBOARD_MAPPING.UP:
                key = exports.TYPE_UP;
                break;

            case KEYBOARD_MAPPING.RIGHT:
                key = exports.TYPE_RIGHT;
                break;

            case KEYBOARD_MAPPING.DOWN:
                key = exports.TYPE_DOWN;
                break;

            case KEYBOARD_MAPPING.CANCEL:
                key = exports.TYPE_CANCEL;
                break;

            case KEYBOARD_MAPPING.ACTION:
                key = exports.TYPE_ACTION;
                break;
        }

        // push key into input stack
        if (key !== constants.INACTIVE) exports.pushAction(key, constants.INACTIVE, constants.INACTIVE);
    }
};

exports.keyboardBackend = new InputBackend(
    KEYBOARD_MAPPING,
    function () {
        debug.logInfo("enable keyboard input");
        document.onkeydown = keyboardHandler;
    },
    function () {
        debug.logInfo("disable keyboard input");
        document.onkeydown = null;
    }
);

var mouseUpEvent = function (ev) {
    var key = constants.INACTIVE;

    // click on canvas while menu is open -> cancel always
    ev = ev || window.event;
    switch (ev.which) {

        // LEFT
        case 1:
            key = input.TYPE_ACTION;
            break;

        // MIDDLE
        case 2:
            break;

        // RIGHT
        case 3:
            key = input.TYPE_CANCEL;
            break;
    }

    // push command into the stack
    if (key !== constants.INACTIVE) input.pushAction(key, constants.INACTIVE, constants.INACTIVE);
};

var mouseMoveEvent = function (ev) {
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

    var data = state.activeState;
    if (data.inputMove) data.inputMove(parseInt(x * sx), parseInt(y * sy));

    // convert to a tile position
    /*
     x = cwt.Screen.offsetX + parseInt(x / cwt.Screen.TILE_BASE, 10);
     y = cwt.Screen.offsetY + parseInt(y / cwt.Screen.TILE_BASE, 10);

     if (x !== cwt.Cursor.x || y !== cwt.Cursor.y) {
     cwt.Input.pushAction(cwt.Input.TYPE_HOVER, x, y);
     }
     */
};

exports.mouseBackend = new InputBackend(
    null,
    function () {
        if (constants.DEBUG) console.log("enable mouse");

        canvas.onmousemove = mouseMoveEvent;
        canvas.onmouseup = mouseUpEvent;
    },
    function () {
        canvas.onmousemove = null;
        canvas.onmouseup = null;
    }
);

var prevTimestamps = [];

var grabGamepads = navigator.getGamepads || navigator.webkitGetGamepads;

var gamepadHandler = function () {
    var gamePads = grabGamepads();

    var i, e;
    for (i = 0, e = 4; i < e; i++) {
        var gamePad = gamePads[i];
        if (gamePad) {

            // check timestamp
            if (prevTimestamps[i] && (gamePad.timestamp === prevTimestamps[i])) continue;
            prevTimestamps[i] = gamePad.timestamp;

            // in key mapping
            if (exports.wantsGenericInput()) {
                if (state.activeState.mode !== 1) {
                    return;
                }

                var code = -1;

                // grab key code of the pressed button
                if (gamePad.elements[0] === 1) {
                    code = 0;
                } else if (gamePad.elements[1] === 1) {
                    code = 1;
                } else if (gamePad.elements[2] === 1) {
                    code = 2;
                } else if (gamePad.elements[3] === 1) {
                    code = 3;
                } else if (gamePad.elements[4] === 1) {
                    code = 4;
                } else if (gamePad.elements[5] === 1) {
                    code = 5;
                } else if (gamePad.elements[6] === 1) {
                    code = 6;
                } else if (gamePad.elements[7] === 1) {
                    code = 7;
                } else if (gamePad.elements[8] === 1) {
                    code = 8;
                } else if (gamePad.elements[9] === 1) {
                    code = 9;
                } else if (gamePad.elements[10] === 1) {
                    code = 10;
                } else if (gamePad.elements[11] === 1) {
                    code = 11;
                } else if (gamePad.elements[12] === 1) {
                    code = 12;
                } else if (gamePad.elements[13] === 1) {
                    code = 13;
                }

                if (code > -1) {
                    state.activeState.genericInput(code);
                }
            } else {
                var key = null;

                // try to extract key
                if (gamePad.buttons[GAMEPAD_MAPPING.ACTION] === 1) {
                    key = exports.TYPE_ACTION;

                } else if (gamePad.buttons[GAMEPAD_MAPPING.CANCEL] === 1) {
                    key = exports.TYPE_CANCEL;

                } else if (gamePad.axes[1] < -0.5) {
                    key = exports.TYPE_UP;

                } else if (gamePad.axes[1] > +0.5) {
                    key = exports.TYPE_DOWN;

                } else if (gamePad.axes[0] < -0.5) {
                    key = exports.TYPE_LEFT;

                } else if (gamePad.axes[0] > +0.5) {
                    key = exports.TYPE_RIGHT;
                }

                // invoke input event when a known key was pressed
                if (key) exports.pushAction(key, constants.INACTIVE, constants.INACTIVE);
            }
        }
    }
};

exports.gamepadBackend = new InputBackend(
    GAMEPAD_MAPPING,

    function () {
        debug.logInfo("enable game pad input");
        exports.gamepadUpdate = gamepadHandler;
    },

    function () {
        debug.logInfo("disable game pad input");
        exports.gamepadUpdate = utility.emptyFunction;
    }
);

exports.gamepadUpdate = utility.emptyFunction;

function inSelection() {
    var cState = state.activeStateId;
    return (
    cState === "INGAME_MOVEPATH"
    || cState === "INGAME_SELECT_TILE_TYPE_A"
    || cState === "INGAME_SELECT_TILE_TYPE_B" );
    // || controller.attackRangeVisible );
}

function inMenu() {
    var cState = state.activeStateId;
    return ( cState === "INGAME_MENU" || cState === "INGAME_SUBMENU" );
}

// Called when an one finger tap occur
//
function oneFingerTap(event, x, y) {
    x = renderer.screenOffsetX + parseInt(x / constants.TILE_BASE, 10);
    y = renderer.screenOffsetY + parseInt(y / constants.TILE_BASE, 10);

    if (!inMenu()) {
        exports.pushAction(exports.TYPE_ACTION, x, y);
        /*
         if (inSelection()) {
         if (stateData.selection.getValue(x, y) > 0) {
         input.pushAction(input.TYPE_ACTION, x, y);
         } else {
         input.pushAction(input.TYPE_CANCEL, x, y);
         }
         } else {
         input.pushAction(input.TYPE_ACTION, x, y);
         }  */

    } else {

        exports.pushAction(exports.TYPE_ACTION, constants.INACTIVE, constants.INACTIVE);

        //if (event.target.id === "cwt_menu") {
        //  input.pushAction(input.TYPE_ACTION, constants.INACTIVE, constants.INACTIVE);
        //} else {
        //  input.pushAction(input.TYPE_CANCEL, constants.INACTIVE, constants.INACTIVE);
        //}
    }
}

// Called when a two finger tap occur
//
function twoFingerTap(event, x, y) {
    exports.pushAction(exports.TYPE_CANCEL, constants.INACTIVE, constants.INACTIVE);
}

// Called when a swipe occur
//
// if dx is not 0 then dy is 0
// if dy is not 0 then dx is 0
//
function swipe(event, dx, dy) {
    var key = null;

    if (dx === 1) key = exports.TYPE_RIGHT;
    if (dy === 1) key = exports.TYPE_DOWN;
    if (dx === -1) key = exports.TYPE_LEFT;
    if (dy === -1) key = exports.TYPE_UP;

    exports.pushAction(key, (stateData.inGameRound ? 10 : 1), constants.INACTIVE);
}

// Called when a drag occur. A drag happens when a one finger tap occurs
// and won't be released for a longer time. The drag happens when the
// finger moves into one direction during the hold.
//
// if dx is not 0 then dy is 0
// if dy is not 0 then dx is 0
//
function oneFingerDrag(event, dx, dy) {
    var key = null;

    if (dx === 1) key = exports.TYPE_RIGHT;
    if (dy === 1) key = exports.TYPE_DOWN;
    if (dx === -1) key = exports.TYPE_LEFT;
    if (dy === -1) key = exports.TYPE_UP;

    exports.pushAction(key, 1, constants.INACTIVE);

    if (!inMenu()) {
        //ON THE

    } else {
        if (event.target.id === "cwt_menu") {
            //INSIDE THE MENU
            //MOVE SELECTION IN DIRECTION OF DRAG

        } else {
            //OUTSIDE THE MENU
            //input.pushAction(input.TYPE_CANCEL, constants.INACTIVE, constants.INACTIVE);
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
        exports.pushAction(exports.TYPE_ACTION, x, y);

        //  OUTSIDE RANGE
        exports.pushAction(exports.TYPE_CANCEL, x, y);

        // IF ATTACK RANGE IS NOT  VISIBLE
        exports.pushAction(exports.TYPE_ACTION, x, y);

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

// ----------------------------------------------------------------------------------------

// positions
//  - first finger
var sx, sy;
var ex, ey;
//  - second finger
var s2x, s2y;
var e2x, e2y;

// timestamp
var st;

// pinch data
var pinDis, pinDis2;

// drag data
var dragDiff = 0;
var isDrag = false;

var touchStartHandler = function (event) {
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
};

var touchMoveHandler = function (event) {
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
};

var touchEndHandler = function (event) {
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
};

exports.touchBackend = new InputBackend(
    null,
    function () {
        if (constants.DEBUG) console.log("enable touch");

        document.addEventListener('touchstart', touchStartHandler, false);
        document.addEventListener('touchmove', touchMoveHandler, false);
        document.addEventListener('touchend', touchEndHandler, false);
    },
    function () {
        document.removeEventListener('touchstart', touchStartHandler, false);
        document.removeEventListener('touchmove', touchMoveHandler, false);
        document.removeEventListener('touchend', touchEndHandler, false);
    }
);