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