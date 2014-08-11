"use strict";

var rendCursor = require("./renderer/cursor");
var rendAnim = require("./renderer/animation");
 
var stateData = require("./dataTransfer/states");
var constants = require("./constants");
var assert = require("./functions").assert;
var model = require("./model");
var move = require("./logic/move");

var canvasW = constants.TILE_BASE * constants.SCREEN_WIDTH;
var canvasH = constants.TILE_BASE * constants.SCREEN_HEIGHT;

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

    var ctx = this.getContext();
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.drawImage(this.getLayer(index), 0, 0, this.w, this.h);
  },

  //
  //
  // @param {Number?} index
  // @return {HTMLCanvasElement}
  //
  getLayer: function (index) {
    if (constants.DEBUG) assert(index === void 0 || (index >= 0 && index < this.layers.length));

    // root ?
    if (index === void 0) {
      return this.cv;
    }

    return this.layers[index];
  },

  //
  //
  // @param {Number?} index
  //
  clear: function (index) {
    this.getContext(index).clearRect(0, 0, this.w, this.h);
  },

  clearAll: function () {
    var n = this.layers.length - 1;
    while (n >= 0) {
      this.clear(n);
      n--;
    }
  },

  //
  //
  // @param {Number?} index
  // @return {CanvasRenderingContext2D}
  //
  getContext: function (index) {
    if (constants.DEBUG) assert(index === void 0 || (index >= 0 && index < this.layers.length));

    // root ?
    if (index === void 0) {
      return this.ctx;
    }

    return this.contexts[index];
  }
});

//
// @class
//
exports.PaginationObject = my.Class({

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
exports.layerBG = new exports.LayeredCanvas("canvas_layer1", 1, canvasW, canvasH);

//
// @type {cwt.LayeredCanvas}
//
exports.layerMap = new exports.LayeredCanvas("canvas_layer2", 8, canvasW, canvasH);

//
// @type {cwt.LayeredCanvas}
//
exports.layerFog = new exports.LayeredCanvas("canvas_layer3", 1, canvasW, canvasH);

//
// @type {cwt.LayeredCanvas}
//
exports.layerUnit = new exports.LayeredCanvas("canvas_layer4", 3, canvasW, canvasH);

//
// @type {cwt.LayeredCanvas}
//
exports.layerEffects = new exports.LayeredCanvas("canvas_layer5", 1, canvasW, canvasH);

//
// @type {cwt.LayeredCanvas}
//
exports.layerUI = new exports.LayeredCanvas("canvas_layer6", 1, canvasW, canvasH);

//
//
// @param moveCode
//
exports.shiftScreen = function (moveCode) {
  var changed = false;

  switch (moveCode) {
    case move.MOVE_CODES_UP:
      if (this.offsetY < model.mapHeight - constants.SCREEN_HEIGHT - 1) {
        this.offsetY++;
        changed = true;
      }
      break;

    case move.MOVE_CODES_RIGHT:
      if (this.offsetX > 0) {
        this.offsetX--;
        changed = true;
      }
      break;

    case move.MOVE_CODES_DOWN:
      if (this.offsetY > 0) {
        this.offsetY--;
        changed = true;
      }
      break;

    case move.MOVE_CODES_LEFT:
      if (this.offsetX < model.mapWidth - constants.SCREEN_WIDTH - 1) {
        this.offsetX++;
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

  this.renderTiles(x, y, w, h);
  this.renderUnits(x, y, w, h);

  // directly update all layers
  exports.layerMap.renderLayer(this.indexMapAnimation);
  exports.layerUnit.renderLayer(this.indexUnitAnimation);

  this.renderFogRect(x, y, w, h);

  if (constants.DEBUG) console.log("rendered the complete screen (" + ((new Date()).getTime() - time) + "ms)");
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
  this.shiftTiles(code);
  this.shiftUnits(code);
  this.shiftFog(code);

  // fill created hole
  this.renderTiles(fx, fy, fw, fh);
  this.renderUnits(fx, fy, fw, fh);
  this.renderFogRect(fx, fy, fw, fh);

  // fix overlay when screen moves down
  if (code === move.MOVE_CODES_DOWN) {
    this.renderTileOverlayRow();
  }

  // directly update all layers
  exports.layerMap.renderLayer(this.indexMapAnimation);
  exports.layerUnit.renderLayer(this.indexUnitAnimation);

  if (constants.DEBUG) console.log("shifted the screen (" + ((new Date()).getTime() - time) + "ms)");
};


// Renders the cursor to the UI layer.
//
exports.eraseCursor = function () {
  rendCursor.eraseCursor(
    exports.layerUI,
    exports.screenOffsetX, exports.screenOffsetY,
    stateData.cursorX, stateData.cursorY
  );
};

// Renders the cursor to the UI layer.
//
exports.renderCursor = function () {
  rendCursor.renderCursor(
    exports.layerUI,
    exports.screenOffsetX, exports.screenOffsetY,
    stateData.cursorX, stateData.cursorY
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

exports.renderCycle = function (delta) {
  rendAnim.evaluateCycle(delta, exports.layerUnit, exports.layerMap);
}