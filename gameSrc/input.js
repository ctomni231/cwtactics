"use strict";

/**
 *
 * @module
 */

var circBuff = require("./system/circularBuffer");
var constants = require("./constants");
var state = require('./statemachine');
var renderer = require("./renderer");
var stateData = require('./stateData');
var system = require("./utility");
var debug = require("./debug");

var canvas = document.getElementById("canvas_layer_UI");
var sx = 1.0;
var sy = 1.0;


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