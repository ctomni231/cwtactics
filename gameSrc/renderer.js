"use strict";

var constants = require("./constants");

var canvasW = constants.TILE_BASE * constants.SCREEN_WIDTH;
var canvasH = constants.TILE_BASE * constants.SCREEN_HEIGHT;

var rendCursor = require("./renderer/cursor");
var rendAnim = require("./renderer/animation");
var rendUnit = require("./renderer/unit");
var rendMenu = require("./renderer/menu");
var rendMap = require("./renderer/map");
var rendFog = require("./renderer/fog");
var rendFocus = require("./renderer/focus");

var stateData = require("./dataTransfer/states");
var assert = require("./system/functions").assert;
var model = require("./model");
var image = require("./image");
var move = require("./logic/move");

rendFog.init(canvasW, canvasH);
rendUnit.init(canvasW, canvasH);
rendFocus.init(canvasW, canvasH);

//
//
// @class
//
exports.LayeredCanvas = my.Class({
  constructor: function (canvasId, frames, w, h) {

    // root canvas
    this.cv = document.getElementById(canvasId);
    this.cv.width = w;
    this.cv.height = h;
    this.ctx = this.cv.getContext("2d");
    this.w = w;
    this.h = h;

    // cached layers
    if (frames > 0) {
      this.contexts = [];
      this.layers = [];

      var n = 0;
      while (n < frames) {
        var cv = document.createElement("canvas");

        cv.width = w;
        cv.height = h;

        this.contexts[n] = cv.getContext("2d");
        this.layers[n] = cv;

        n++;
      }
    }
  },

  //
  //
  // @param {Number} index
  //
  renderLayer: function (index) {
    if (constants.DEBUG) assert(arguments.length === 0 || (index >= 0 && index < this.layers.length));

    var ctx = this.getContext(constants.INACTIVE);
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.drawImage(this.getLayer(index), 0, 0, this.w, this.h);
  },

  //
  //
  // @param {Number?} index
  // @return {HTMLCanvasElement}
  //
  getLayer: function (index) {
    if (arguments.length === 0) index = constants.INACTIVE;

    if (constants.DEBUG) assert(index === constants.INACTIVE || (index >= 0 && index < this.layers.length));

    // root ?
    if (index === constants.INACTIVE) {
      return this.cv;
    }

    return this.layers[index];
  },

  //
  //
  // @param {Number?} index
  //
  clear: function (index) {
    if (arguments.length === 0) index = constants.INACTIVE;

    this.getContext(index).clearRect(0, 0, this.w, this.h);
  },

  clearAll: function () {
    var n = this.layers.length - 1;
    while (n >= 0) {
      this.clear(n);
      n--;
    }
    this.clear();
  },

  //
  //
  // @param {Number?} index
  // @return {CanvasRenderingContext2D}
  //
  getContext: function (index) {
    if (arguments.length === 0) index = constants.INACTIVE;

    if (constants.DEBUG) assert(index === constants.INACTIVE || (index >= 0 && index < this.layers.length));

    // root ?
    if (index === constants.INACTIVE) {
      return this.ctx;
    }

    return this.contexts[index];
  }
});

//
// @class
//
exports.Pagination = my.Class({

  constructor: function (list, pageSize, updateFn) {
    this.page = 0;
    this.list = list;

    this.entries = [];
    while (pageSize > 0) {
      this.entries.push(null);
      pageSize--;
    }

    this.updateFn = updateFn;
  },

  //
  // Selects a page from the list. The entries of the selected page will be saved in the **entries** property
  // of the pagination object.
  //
  selectPage: function (index) {
    var PAGE_SIZE = this.entries.length;

    if (index < 0 || index * PAGE_SIZE >= this.list.length) {
      return;
    }

    this.page = index;

    index = (index * PAGE_SIZE);
    for (var n = 0; n < PAGE_SIZE; n++) {
      this.entries[n] = (index + n >= this.list.length) ? null : this.list[index + n];
    }

    if (this.updateFn) {
      this.updateFn();
    }
  }

});

exports.screenWidth = canvasW;

exports.screenHeight = canvasH;

exports.screenOffsetX = 0;

exports.screenOffsetY = 0;

exports.convertToTilePos = function (p) {
  return parseInt(p / constants.TILE_BASE, 10);
};

//
// @type {cwt.LayeredCanvas}
//
exports.layerBG = new exports.LayeredCanvas("canvas_layer_Background", 1, canvasW, canvasH);

//
// @type {cwt.LayeredCanvas}
//
exports.layerMap = new exports.LayeredCanvas("canvas_layer_Map", 8, canvasW, canvasH);

//
// @type {cwt.LayeredCanvas}
//
exports.layerFog = new exports.LayeredCanvas("canvas_layer_Fog", 1, canvasW, canvasH);

//
// @type {cwt.LayeredCanvas}
//
exports.layerUnit = new exports.LayeredCanvas("canvas_layer_Unit", 3, canvasW, canvasH);

//
// @type {cwt.LayeredCanvas}
//
exports.layerFocus = new exports.LayeredCanvas("canvas_layer_Focus", 7, canvasW, canvasH);

//
// @type {cwt.LayeredCanvas}
//
exports.layerEffects = new exports.LayeredCanvas("canvas_layer_Effects", 1, canvasW, canvasH);

//
// @type {cwt.LayeredCanvas}
//
exports.layerUI = new exports.LayeredCanvas("canvas_layer_UI", 1, canvasW, canvasH);

//
//
// @param moveCode
//
exports.shiftScreen = function (moveCode) {
  var changed = false;

  switch (moveCode) {
    case move.MOVE_CODES_UP:
      if (exports.screenOffsetY < model.mapHeight - constants.SCREEN_HEIGHT - 1) {
        exports.screenOffsetY++;
        changed = true;
      }
      break;

    case move.MOVE_CODES_RIGHT:
      if (exports.screenOffsetX > 0) {
        exports.screenOffsetX--;
        changed = true;
      }
      break;

    case move.MOVE_CODES_DOWN:
      if (exports.screenOffsetY > 0) {
        exports.screenOffsetY--;
        changed = true;
      }
      break;

    case move.MOVE_CODES_LEFT:
      if (exports.screenOffsetX < model.mapWidth - constants.SCREEN_WIDTH - 1) {
        exports.screenOffsetX++;
        changed = true;
      }
      break;
  }

  return changed;
};

//
//
//
exports.renderScreen = function () {
  var time;
  if (constants.DEBUG) time = (new Date()).getTime();

  var x = exports.screenOffsetX;
  var y = exports.screenOffsetY;
  var w = (model.mapWidth < constants.SCREEN_WIDTH) ? model.mapWidth : constants.SCREEN_WIDTH;
  var h = (model.mapHeight < constants.SCREEN_HEIGHT) ? model.mapHeight : constants.SCREEN_HEIGHT;

  exports.renderTiles(x, y, w, h);
  exports.renderUnits(x, y, w, h);
  exports.renderFocus(x, y, w, h);

  // directly update all layers
  exports.layerMap.renderLayer(rendAnim.indexMapAnimation);
  exports.layerUnit.renderLayer(rendAnim.indexUnitAnimation);
  exports.layerFocus.renderLayer(rendAnim.indexEffectAnimation);

  exports.renderFogRect(x, y, w, h);

  if (constants.DEBUG) console.log("rendered the complete screen (" + ((new Date()).getTime() - time) + "ms)");
};

exports.renderFocusOnScreen = function () {
  var time;
  if (constants.DEBUG) time = (new Date()).getTime();

  var x = exports.screenOffsetX;
  var y = exports.screenOffsetY;
  var w = (model.mapWidth < constants.SCREEN_WIDTH) ? model.mapWidth : constants.SCREEN_WIDTH;
  var h = (model.mapHeight < constants.SCREEN_HEIGHT) ? model.mapHeight : constants.SCREEN_HEIGHT;

  exports.renderFocus(x, y, w, h);
  exports.layerFocus.renderLayer(rendAnim.indexEffectAnimation);

  if (constants.DEBUG) console.log("rendered focus on screen (" + ((new Date()).getTime() - time) + "ms)");
};

//
//
// @param {number} code
//
exports.shiftMap = function (code) {
  var time;
  if (constants.DEBUG) time = (new Date()).getTime();

  var fx = exports.screenOffsetX;
  var fy = exports.screenOffsetY;
  var fw = constants.SCREEN_WIDTH;
  var fh = constants.SCREEN_HEIGHT;

  // extract needed data for the shift process
  switch (code) {
    case move.MOVE_CODES_LEFT:
      fx += constants.SCREEN_WIDTH - 1;
      fw = 1;
      break;

    case move.MOVE_CODES_RIGHT:
      fw = 1;
      break;

    case move.MOVE_CODES_UP:
      fy += constants.SCREEN_HEIGHT - 1;
      fh = 1;
      break;

    case move.MOVE_CODES_DOWN:
      fh = 1;
      break;
  }

  // shift screen
  exports.shiftTiles(code);
  exports.shiftUnits(code);
  exports.shiftFocus(code);
  exports.shiftFog(code);

  // fill created hole
  exports.renderTiles(fx, fy, fw, fh);
  exports.renderUnits(fx, fy, fw, fh);
  exports.renderFocus(fx, fy, fw, fh);
  exports.renderFogRect(fx, fy, fw, fh);

  // fix overlay when screen moves down
  if (code === move.MOVE_CODES_DOWN) {
    exports.renderTileOverlayRow();
  }

  // directly update all layers
  exports.layerMap.renderLayer(rendAnim.indexMapAnimation);
  exports.layerUnit.renderLayer(rendAnim.indexUnitAnimation);
  exports.layerFocus.renderLayer(rendAnim.indexEffectAnimation);

  if (stateData.focusMode === image.Sprite.FOCUS_MOVE) {
    exports.layerEffects.clearAll();
    exports.renderMovePath();
    exports.layerEffects.renderLayer(0);
  }

  if (constants.DEBUG) console.log("shifted the screen (" + ((new Date()).getTime() - time) + "ms)");
};


// Renders the cursor to the UI layer.
//
exports.eraseCursor = function (x, y) {
  rendCursor.eraseCursor(
    exports.layerUI,
    exports.screenOffsetX, exports.screenOffsetY,
    x, y
  );
};

// Renders the cursor to the UI layer.
//
exports.renderCursor = function (x, y) {
  rendCursor.renderCursor(
    exports.layerUI,
    exports.screenOffsetX, exports.screenOffsetY,
    x, y
  );
};

// Shows the native browser cursor.
//
exports.showNativeCursor = function () {
  rendCursor.showNativeCursor(exports.layerUI);
};

// Hides the native browser cursor.
//
exports.hideNativeCursor = function () {
  rendCursor.hideNativeCursor(exports.layerUI);
};

exports.evaluateCycle = function (delta) {
  rendAnim.evaluateCycle(delta, exports.layerUnit, exports.layerMap, exports.layerFocus);
};

//
//
exports.renderFogCircle = function (x, y, range) {
  rendFog.renderFogRect(exports.layerFog, exports.screenOffsetX, exports.screenOffsetY, x, y, range);
};

//
//
exports.renderFogRect = function (x, y, w, h, circle) {
  rendFog.renderFogRect(exports.layerFog, exports.screenOffsetX, exports.screenOffsetY, x, y, w, h, circle);
};

//
//
exports.renderFogBackgroundLayer = function () {
  rendFog.renderFogBackgroundLayer(exports.layerFog);
};

//
//
exports.shiftFog = function (code) {
  rendFog.shiftFog(exports.layerFog, code);
};

//
//
exports.renderUnits = function (x, oy, w, h) {
  rendUnit.renderUnits(exports.layerUnit, exports.screenOffsetX, exports.screenOffsetY, x, oy, w, h);
};

//
//
exports.shiftUnits = function (code) {
  rendUnit.shiftUnits(exports.layerUnit, code);
};

//
//
exports.prepareMenu = function (menu) {
  rendMenu.prepareMenu(exports.layerUI, exports.screenWidth, exports.screenHeight, menu);
};

//
//
exports.renderMenu = function () {
  rendMenu.renderMenu(exports.layerUI);
};

//
//
exports.renderMovePath = function () {
  rendCursor.renderPath(
    exports.layerEffects,
    exports.screenOffsetX, exports.screenOffsetY,
    stateData.source.x, stateData.source.y,
    stateData.movePath
  );
};

//
//
exports.updateMenuIndex = function (x, y) {
  rendMenu.updateMenuIndex(x, y);
};

//
//
exports.handleMenuInput = function (code) {
  return rendMenu.handleMenuInput(code);
};

//
//
exports.getMenuIndex = function () {
  return rendMenu.getMenuIndex();
};

//
//
// @param {number} x
// @param {number} y
//
exports.renderTile = function (x, y) {
  rendMap.renderTile(exports.layerMap, exports.screenOffsetX, exports.screenOffsetY, x, y);
};

exports.renderTileOverlayRow = function () {
  rendMap.renderTileOverlayRow(exports.layerMap, exports.screenOffsetX, exports.screenOffsetY);
};

exports.renderTiles = function (x, oy, w, h, overlayDraw) {
  rendMap.renderTiles(exports.layerMap, exports.screenOffsetX, exports.screenOffsetY, x, oy, w, h, overlayDraw);
};

//
//
// Note: this one does not clear the layer before action
//
// @param {number} code
//
exports.shiftTiles = function (code) {
  rendMap.shiftTiles(exports.layerMap, code);
};

exports.renderFocus = function (x, y, w, h) {
  rendFocus.renderSelection(
    exports.layerFocus,
    exports.screenOffsetX, exports.screenOffsetY,
    stateData.selection,
    x, y,
    w, h,
    stateData.focusMode
  );
};

exports.shiftFocus = function (code) {
  rendFocus.shift(exports.layerFocus, stateData.selection, code);
};