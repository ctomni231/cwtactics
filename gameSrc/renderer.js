"use strict";

/**
 * CW:T uses a complete new layer based rendering, that uses CanvasRenderingContext2D only, with version 0.38 and up.
 *
 * TODO => renderer should make fog for all first and remove fog then -> this will prevent overlay errors
 *
 * @module
 */

var constants = require("./constants");
var stateData = require("./stateData");
var widgets = require("./gui");
var debug = require("./debug");
var model = require("./model");
var image = require("./image");
var input = require("./input");
var move = require("./logic/move");
var util = require("./utility");
var i18n = require("./localization");

var MENU_ELEMENTS_MAX = 10;
var MENU_ENTRY_HEIGHT = 2 * constants.TILE_BASE;
var MENU_ENTRY_WIDTH = 10 * constants.TILE_BASE;
var ANIMATION_TICK_TIME = 150;

var canvasW = constants.TILE_BASE * constants.SCREEN_WIDTH;
var canvasH = constants.TILE_BASE * constants.SCREEN_HEIGHT;

var tempCanvas;
tempCanvas = document.createElement("canvas");
tempCanvas.width = canvasW;
tempCanvas.height = canvasH;

/**
 * @class
 */
exports.LayeredCanvas = util.Structure({
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

  /**
   *
   * @param index
   */
  renderLayer: function (index) {
    if (constants.DEBUG) assert(arguments.length === 0 || (index >= 0 && index < this.layers.length));

    var ctx = this.getContext(constants.INACTIVE);
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.drawImage(this.getLayer(index), 0, 0, this.w, this.h);
  },

  /**
   *
   * @param {number?} index
   * @returns {HTMLCanvasElement}
   */
  getLayer: function (index) {
    if (arguments.length === 0) index = constants.INACTIVE;

    if (constants.DEBUG) assert(index === constants.INACTIVE || (index >= 0 && index < this.layers.length));

    // root ?
    if (index === constants.INACTIVE) {
      return this.cv;
    }

    return this.layers[index];
  },

  /**
   *
   * @param index
   */
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

  /**
   *
   * @param {number?} index
   * @returns {CanvasRenderingContext2D}
   */
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

/**
 * @class
 */
exports.Pagination = util.Structure({
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

  /**
   * Selects a page from the list. The entries of the selected page will be saved in the **entries** property
   * of the pagination object.
   *
   * @param index
   */
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

/**
 * @type {cwt.LayeredCanvas}
 */
exports.layerBG = new exports.LayeredCanvas("canvas_layer_Background", 1, canvasW, canvasH);

/**
 * @type {cwt.LayeredCanvas}
 */
exports.layerMap = new exports.LayeredCanvas("canvas_layer_Map", 8, canvasW, canvasH);

/**
 * @type {cwt.LayeredCanvas}
 */
exports.layerFog = new exports.LayeredCanvas("canvas_layer_Fog", 1, canvasW, canvasH);

/**
 * @type {cwt.LayeredCanvas}
 */
exports.layerUnit = new exports.LayeredCanvas("canvas_layer_Unit", 3, canvasW, canvasH);

/**
 * @type {cwt.LayeredCanvas}
 */
exports.layerFocus = new exports.LayeredCanvas("canvas_layer_Focus", 7, canvasW, canvasH);

/**
 * @type {cwt.LayeredCanvas}
 */
exports.layerEffects = new exports.LayeredCanvas("canvas_layer_Effects", 1, canvasW, canvasH);

/**
 * @type {cwt.LayeredCanvas}
 */
exports.layerUI = new exports.LayeredCanvas("canvas_layer_UI", 1, canvasW, canvasH);

/**
 *
 */
exports.screenWidth = canvasW;

/**
 *
 */
exports.screenHeight = canvasH;

/**
 *
 */
exports.screenOffsetX = 0;

/**
 *
 */
exports.screenOffsetY = 0;

/**
 *
 */
exports.convertToTilePos = function (p) {
  return parseInt(p / constants.TILE_BASE, 10);
};

/**
 * @param moveCode
 */
exports.shiftScreen = function (moveCode) {
  var smallerW = (model.mapWidth < constants.SCREEN_WIDTH);
  var smallerH = (model.mapHeight < constants.SCREEN_HEIGHT);
  var changed = false;

  switch (moveCode) {
    case move.MOVE_CODES_UP:
      if (!smallerH && exports.screenOffsetY < model.mapHeight - constants.SCREEN_HEIGHT - 1) {
        exports.screenOffsetY++;
        changed = true;
      }
      break;

    case move.MOVE_CODES_RIGHT:
      if (!smallerW && exports.screenOffsetX > 0) {
        exports.screenOffsetX--;
        changed = true;
      }
      break;

    case move.MOVE_CODES_DOWN:
      if (!smallerH && exports.screenOffsetY > 0) {
        exports.screenOffsetY--;
        changed = true;
      }
      break;

    case move.MOVE_CODES_LEFT:
      if (!smallerW && exports.screenOffsetX < model.mapWidth - constants.SCREEN_WIDTH - 1) {
        exports.screenOffsetX++;
        changed = true;
      }
      break;
  }

  return changed;
};

/**
 *
 */
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

/**
 *
 */
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

/**
 *
 */
exports.renderUnitsOnScreen = function () {
  var time;
  if (constants.DEBUG) time = (new Date()).getTime();

  var x = exports.screenOffsetX;
  var y = exports.screenOffsetY;
  var w = (model.mapWidth < constants.SCREEN_WIDTH) ? model.mapWidth : constants.SCREEN_WIDTH;
  var h = (model.mapHeight < constants.SCREEN_HEIGHT) ? model.mapHeight : constants.SCREEN_HEIGHT;

  exports.layerUnit.clearAll();

  exports.renderUnits(x, y, w, h);
  exports.layerUnit.renderLayer(rendAnim.indexUnitAnimation);

  if (constants.DEBUG) console.log("rendered units screen (" + ((new Date()).getTime() - time) + "ms)");
};

/**
 * @param {number} code
 */
exports.shiftMap = function (code) {
  var time;
  if (constants.DEBUG) time = (new Date()).getTime();

  var fx = exports.screenOffsetX;
  var fy = exports.screenOffsetY;
  var fw = (model.mapWidth < constants.SCREEN_WIDTH) ? model.mapWidth : constants.SCREEN_WIDTH;
  var fh = (model.mapHeight < constants.SCREEN_HEIGHT) ? model.mapHeight : constants.SCREEN_HEIGHT;

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

/* ---------------------------------- SUBMODULE: CURSOR RENDERER ---------------------------------- */

/** Renders the cursor to the UI layer. */
exports.eraseCursor = function (x, y) {
  var cursorImg = image.sprites["CURSOR"].getImage(0);
  var ctx = exports.layerUI.getContext();
  var h = constants.TILE_BASE / 2;
  x = (x - exports.screenOffsetX) * constants.TILE_BASE;
  y = (y - exports.screenOffsetY) * constants.TILE_BASE;

  // render cursor at new position
  ctx.drawImage(cursorImg, x - h, y - h);
  ctx.drawImage(cursorImg, x + h + h, y + h + h);
  ctx.drawImage(cursorImg, x + h + h, y - h);
  ctx.drawImage(cursorImg, x - h, y + h + h);
};

/** Renders the cursor to the UI layer. */
exports.renderCursor = function (x, y) {
  var cursorImg = image.sprites["CURSOR"].getImage(0);
  var ctx = exports.layerUI.getContext();
  var h = constants.TILE_BASE / 2;
  x = (x - exports.screenOffsetX) * constants.TILE_BASE;
  y = (y - exports.screenOffsetY) * constants.TILE_BASE;

  // render cursor at new position
  ctx.drawImage(cursorImg, x - h, y - h);
  ctx.drawImage(cursorImg, x + h + h, y + h + h);
  ctx.drawImage(cursorImg, x + h + h, y - h);
  ctx.drawImage(cursorImg, x - h, y + h + h);
};

/** Shows the native browser cursor. */
exports.showNativeCursor = function () {
  exports.layerUI.getLayer().style.cursor = "";
};

/** Hides the native browser cursor. */
exports.hideNativeCursor = function () {
  exports.layerUI.getLayer().style.cursor = "none";
};

/** */
exports.renderMovePath = function () {
  var layer = exports.layerEffects;
  var offsetX = exports.screenOffsetX;
  var offsetY = exports.screenOffsetY;
  var x = stateData.source.x;
  var y = stateData.source.y;
  var path = stateData.movePath;

  var arrowSprite = image.sprites["ARROW"];
  var oX;
  var oY;
  var tX;
  var tY;
  var pic;
  for (var i = 0, e = path.size; i < e; i++) {

    oX = x;
    oY = y;

    switch (path.data[i]) {

      case move.MOVE_CODES_DOWN:
        y++;
        break;

      case move.MOVE_CODES_UP:
        y--;
        break;

      case move.MOVE_CODES_LEFT:
        x--;
        break;

      case move.MOVE_CODES_RIGHT:
        x++;
        break;
    }


    // NEXT TILE
    if (path.size <= i + 1) {
      tX = -1;
      tY = -1;
    } else {
      switch (path.data[i + 1]) {

        case move.MOVE_CODES_UP :
          tX = x;
          tY = y - 1;
          break;

        case move.MOVE_CODES_RIGHT :
          tX = x + 1;
          tY = y;
          break;

        case move.MOVE_CODES_DOWN :
          tX = x;
          tY = y + 1;
          break;

        case move.MOVE_CODES_LEFT :
          tX = x - 1;
          tY = y;
          break;
      }
    }

    // TARGET TILE
    if (tX == -1) {
      switch (path.data[i]) {

        case move.MOVE_CODES_UP:
          pic = arrowSprite.getImage(image.Sprite.DIRECTION_N);
          break;

        case move.MOVE_CODES_RIGHT :
          pic = arrowSprite.getImage(image.Sprite.DIRECTION_E);
          break;

        case move.MOVE_CODES_DOWN :
          pic = arrowSprite.getImage(image.Sprite.DIRECTION_S);
          break;

        case move.MOVE_CODES_LEFT :
          pic = arrowSprite.getImage(image.Sprite.DIRECTION_W);
          break;
      }
    } else {

      var diffX = Math.abs(tX - oX);
      var diffY = Math.abs(tY - oY);

      // IN THE MIDDLE OF THE WAY
      if (diffX === 2) {
        pic = arrowSprite.getImage(image.Sprite.DIRECTION_WE);

      } else if (diffY === 2) {
        pic = arrowSprite.getImage(image.Sprite.DIRECTION_NS);

      } else if ((tX < x && oY > y) || (oX < x && tY > y)) {
        pic = arrowSprite.getImage(image.Sprite.DIRECTION_SW);

      } else if ((tX < x && oY < y) || (oX < x && tY < y)) {
        pic = arrowSprite.getImage(image.Sprite.DIRECTION_NW);

      } else if ((tX > x && oY < y) || (oX > x && tY < y)) {
        pic = arrowSprite.getImage(image.Sprite.DIRECTION_NE);

      } else if ((tX > x && oY > y) || (oX > x && tY > y)) {
        pic = arrowSprite.getImage(image.Sprite.DIRECTION_SE);

      } else {
        throw new Error("illegal move arrow state "+
            "-> old (", oX, ",", oY, ") "+
            "-> current (", x, ",", y, ") "+
            "-> next (", tX, ",", tY, ") "+
            "-> path (", path, ")"
        );

        continue;
      }
    }

    if (x >= 0 && y >= 0) {
      layer.getContext(0).drawImage(
          pic,
          (x - offsetX) * constants.TILE_BASE,
          (y - offsetY) * constants.TILE_BASE
      );
    }
  }
};

/* ---------------------------------- SUBMODULE: ANIMATION ---------------------------------- */

/** */
var unitAnimationHalfStep = false;

/** */
var curTime = 0;

/** */
exports.indexUnitAnimation = 0;

/** */
exports.indexMapAnimation = 0;

/** */
exports.indexEffectAnimation = 0;

/** */
exports.evaluateCycle = function (delta) {
  var index;

  curTime += delta;
  if (curTime > ANIMATION_TICK_TIME) {
    curTime = 0;

    // calc unit animation layer step
    unitAnimationHalfStep = !unitAnimationHalfStep;
    if (!unitAnimationHalfStep) {

      index = exports.indexUnitAnimation + 1;
      if (index === 3) {
        index = 0;
      }

      // render unit animation layer
      exports.layerUnit.renderLayer(index);
      exports.indexUnitAnimation = index;
    }

    // map animation layer
    index = exports.indexMapAnimation + 1;
    if (index === 8) {
      index = 0;
    }

    // render map animation layer
    exports.layerMap.renderLayer(index);
    exports.indexMapAnimation = index;

    // effect animation layer
    index = exports.indexEffectAnimation + 1;
    if (index === 7) {
      index = 0;
    }

    // render map animation layer
    exports.layerFocus.renderLayer(index);
    exports.indexEffectAnimation = index;
  }
};

/* ---------------------------------- SUBMODULE: FOG RENDERER ---------------------------------- */

var fixOverlayFog_ = function (x, y, isTop) {
  if (isTop) {} else {}
};

/** Note: this one clears the area before action */
exports.renderFogCircle = function (x, y, range) {
  exports.renderFogRect(x, y, range, range, true);
};

/** Note: this one clears the area before action */
exports.renderFogRect = function (x, y, w, h, circle) {
  var layerFog = exports.layerFog;
  var offsetX = exports.screenOffsetX;
  var offsetY = exports.screenOffsetY;

  if (arguments.length === 4) circle = false;
  var data = model.mapData;
  var layer = layerFog.getContext(0);
  var cx, cy, range;

  if (circle) {

    // prepare meta data for the circle center and the pseudo-circle search field
    cx = x;
    cy = y;
    x -= w;
    y -= h;
    range = w;
    w += w+1;
    h += w+1;

  } else {

    // clear area in background layer as rectangle only in rectangle mode
    layer.clearRect(
        (x - offsetX) * constants.TILE_BASE,
        (y - offsetY) * constants.TILE_BASE,
        w * constants.TILE_BASE,
        h * constants.TILE_BASE
    );
  }

  // render
  var oy = y;
  for (var xe = x + w; x < xe; x++) {
    y = oy;
    for (var ye = y + h; y < ye; y++) {
      var distance;

      if (circle) {
        distance = model.getDistance(x, y, cx, cy);
        if (!model.isValidPosition(x, y) || distance > range) {
          continue;
        }

        // clear position
        layer.clearRect(
            (x - offsetX) * constants.TILE_BASE,
            (y - offsetY) * constants.TILE_BASE,
            constants.TILE_BASE,
            constants.TILE_BASE
        );
      }

      var tile = data[x][y];
      if (tile.visionClient === 0) {

        var sprite = null;
        if (tile.property) {
          sprite = image.sprites[tile.property.type.ID].getImage(
              image.Sprite.PROPERTY_SHADOW_MASK
          );
        } else {
          sprite = image.sprites[tile.type.ID].getImage(
              tile.variant * image.Sprite.TILE_STATES + image.Sprite.TILE_SHADOW
          );
        }

        var scx = (image.longAnimatedTiles[tile.type.ID]) ? constants.TILE_BASE * animation.indexMapAnimation : 0;
        var scy = 0;
        var scw = constants.TILE_BASE;
        var sch = constants.TILE_BASE * 2;
        var tcx = (x - offsetX) * constants.TILE_BASE;
        var tcy = (y - offsetY) * constants.TILE_BASE - constants.TILE_BASE;
        var tcw = constants.TILE_BASE;
        var tch = constants.TILE_BASE * 2;

        if (tcy < 0) {
          scy = scy + constants.TILE_BASE;
          sch = sch - constants.TILE_BASE;
          tcy = tcy + constants.TILE_BASE;
          tch = tch - constants.TILE_BASE;
        }

        layer.drawImage(
            sprite,
            scx, scy,
            scw, sch,
            tcx, tcy,
            tcw, tch
        );
      } else {

        // fix overlays on all tiles that are at the max range in the circle mode
        if (circle) {
          if (distance === range) {

            // top check
            if (y <= cy) {
              fixOverlayFog_(x, y, true);
            }

            // bottom check
            if (y >= cy) {
              fixOverlayFog_(x, y, false);
            }
          }
        }
      }
    }
  }

  // fix overlay top and bottom in the rectangle mode
  if (!circle) {

  }

  exports.renderFogBackgroundLayer(layerFog);
};

/** Note: this one clears the area before action */
exports.renderFogBackgroundLayer = function () {
  var layerFog = exports.layerFog;

  layerFog.getContext().globalAlpha = 0.35;
  layerFog.renderLayer(0);
  layerFog.getContext().globalAlpha = 1;
};

/** Note: this one clears the layer before action */
exports.shiftFog = function (code) {
  var layer = exports.layerFog;
  var tmpContext = tempCanvas.getContext("2d");

  // calculate meta data for shift
  var sx = 0;
  var sy = 0;
  var scx = 0;
  var scy = 0;
  var w = layer.w;
  var h = layer.h;
  switch (code) {
    case move.MOVE_CODES_LEFT:
      scx += constants.TILE_BASE;
      w -= constants.TILE_BASE;
      break;

    case move.MOVE_CODES_RIGHT:
      sx += constants.TILE_BASE;
      w -= constants.TILE_BASE;
      break;

    case move.MOVE_CODES_UP:
      scy += constants.TILE_BASE;
      h -= constants.TILE_BASE;
      break;

    case move.MOVE_CODES_DOWN:
      sy += constants.TILE_BASE;
      h -= constants.TILE_BASE;
      break;
  }

  tmpContext.clearRect(0, 0, layer.w, layer.h);

  // copy visible content to temp canvas
  tmpContext.drawImage(
      layer.getLayer(0),
      scx, scy,
      w, h,
      sx, sy,
      w, h
  );

  // clear original canvas
  layer.clear(0);

  // copy visible content back to the original canvas
  layer.getContext(0).drawImage(tempCanvas, 0, 0);

  exports.renderFogBackgroundLayer(layer);
};

/* ---------------------------------- SUBMODULE: UNIT RENDERER ---------------------------------- */

var hiddenUnitId = constants.INACTIVE;

/** NOTE: does not clear the area before update */
exports.renderUnits = function (x, oy, w, h) {
  var layer = exports.layerUnit;
  var mapData = model.mapData;
  var halfTileBase = parseInt(constants.TILE_BASE / 2, 10);
  var hiddenUnit = (hiddenUnitId !== constants.INACTIVE ? model.units[hiddenUnitId] : null);

  for (var xe = x + w; x < xe; x++) {
    for (var y = oy, ye = y + h; y < ye; y++) {
      var tile = mapData[x][y];
      if (tile.visionClient === 0) continue;

      var unit = tile.unit;
      if (!unit || hiddenUnit === unit) continue;

      var state;
      switch (unit.owner.id) {
        case 0:
          state = image.Sprite.UNIT_RED;
          break;

        case 1:
          state = image.Sprite.UNIT_BLUE;
          break;

        case 2:
          state = image.Sprite.UNIT_GREEN;
          break;

        case 3:
          state = image.Sprite.UNIT_YELLOW;
          break;
      }

      // inverted ?
      var shadowSprite;
      if (unit.owner.id % 2 === 0) {
        state += image.Sprite.UNIT_STATE_IDLE_INVERTED;
        shadowSprite = image.sprites[unit.type.ID].getImage(image.Sprite.UNIT_SHADOW_MASK +
        image.Sprite.UNIT_STATE_IDLE_INVERTED);
      } else {
        shadowSprite = image.sprites[unit.type.ID].getImage(image.Sprite.UNIT_SHADOW_MASK);
      }

      var used = !unit.canAct;
      var sprite = image.sprites[unit.type.ID].getImage(state);
      var n = 0;
      while (n < 3) {
        var ctx = layer.getContext(n);

        var scx = (constants.TILE_BASE * 2) * n;
        var scy = 0;
        var scw = constants.TILE_BASE * 2;
        var sch = constants.TILE_BASE * 2;
        var tcx = (x - exports.screenOffsetX) * constants.TILE_BASE - halfTileBase;
        var tcy = (y - exports.screenOffsetY) * constants.TILE_BASE - halfTileBase;
        var tcw = constants.TILE_BASE + constants.TILE_BASE;
        var tch = constants.TILE_BASE + constants.TILE_BASE;

        ctx.drawImage(
            sprite,
            scx, scy,
            scw, sch,
            tcx, tcy,
            tcw, tch
        );

        if (used) {
          ctx.globalAlpha = 0.35;
          ctx.drawImage(
              shadowSprite,
              scx, scy,
              scw, sch,
              tcx, tcy,
              tcw, tch
          );
          ctx.globalAlpha = 1;
        }

        n++;
      }

    }
  }
};

/** Note: this one clears the layer before action */
exports.shiftUnits = function (code) {
  var layer = exports.layerUnit;
  var tmpContext = tempCanvas.getContext("2d");

  // calculate meta data for shift
  var sx = 0;
  var sy = 0;
  var scx = 0;
  var scy = 0;
  var w = layer.w;
  var h = layer.h;
  switch (code) {
    case move.MOVE_CODES_LEFT:
      scx += constants.TILE_BASE;
      w -= constants.TILE_BASE;
      break;

    case move.MOVE_CODES_RIGHT:
      sx += constants.TILE_BASE;
      w -= constants.TILE_BASE;
      break;

    case move.MOVE_CODES_UP:
      scy += constants.TILE_BASE;
      h -= constants.TILE_BASE;
      break;

    case move.MOVE_CODES_DOWN:
      sy += constants.TILE_BASE;
      h -= constants.TILE_BASE;
      break;
  }

  // update background layers
  var n = 0;
  while (n < 3) {
    tmpContext.clearRect(0, 0, layer.w, layer.h);

    // copy visible content to temp canvas
    tmpContext.drawImage(
        layer.getLayer(n),
        scx, scy,
        w, h,
        sx, sy,
        w, h
    );

    // clear original canvas
    layer.clear(n);

    // copy visible content back to the original canvas
    layer.getContext(n).drawImage(tempCanvas, 0, 0);

    n++;
  }
};

/** */
exports.setHiddenUnitId = function (unit) {
  hiddenUnitId = unit;
};

/* ---------------------------------- SUBMODULE: MENU RENDERER ---------------------------------- */

var layoutGenericMenu = new widgets.UIPositionableButtonGroup();

var menuShift = 0;

/* pre-generate an in-memory menu object that can be used as ... */
util.repeat(MENU_ELEMENTS_MAX, function(i) {
  layoutGenericMenu.addElement(new widgets.UIField(
      0, i * 32,
      MENU_ENTRY_WIDTH, MENU_ENTRY_HEIGHT,
      "KEY_" + i,
      8,
      widgets.UIField.STYLE_NORMAL,

      // logic will be handled by the state machine
      util.emptyFunction
  ))
});

/** */
exports.prepareMenu = function () {
  var menu = stateData.menu;
  var gfxMenu = layoutGenericMenu;
  var numElements = menu.getSize();
  if (numElements > MENU_ELEMENTS_MAX) numElements = MENU_ELEMENTS_MAX;

  // set the position of the menu
  gfxMenu.setMenuPosition(
      parseInt((exports.screenWidth / 2) - MENU_ENTRY_WIDTH / 2, 10),
      parseInt((exports.screenHeight / 2) - ((numElements * MENU_ENTRY_HEIGHT) / 2), 10)
  );

  for (var i = 0; i < MENU_ELEMENTS_MAX; i++) {
    if (i < numElements) {
      gfxMenu.elements[i].inactive = false;
      gfxMenu.elements[i].text = i18n.forKey(menu.getContent(menuShift + i));

      // set style
      gfxMenu.elements[i].style = (
          (numElements === 1 ? widgets.UIField.STYLE_NORMAL :
              (i === 0 ? widgets.UIField.STYLE_NEW :
                  (i === numElements - 1 || i === menuShift + MENU_ELEMENTS_MAX - 1 ? widgets.UIField.STYLE_ESW :
                      widgets.UIField.STYLE_EW)))
      );

    } else {
      gfxMenu.elements[i].inactive = true;
    }
  }

  exports.renderMenu(exports.layerUI);
};

/** */
exports.renderMenu = function () {
  layoutGenericMenu.draw(exports.layerUI.getContext(0));
};

/** */
exports.resetMenuShift = function() {
  menuShift = 0;
};

/** */
exports.updateMenuIndex = function (x, y) {
  layoutGenericMenu.updateIndex(x, y);
  // TODO -> when the index is at the boundaries then change page if necessary
};

/** */
exports.handleMenuInput = function (code) {
  var shiftedMenu = false;
  var menu = stateData.menu;

  // the menu size must be greater then the menu size
  if (menu.getSize() > MENU_ELEMENTS_MAX) {
    var currentIndex = layoutGenericMenu.selected;

    switch (code) {
      case input.TYPE_UP:
        if (currentIndex < 2 && menuShift > 0) {
          shiftedMenu = true;
          menuShift--;
        } else if (currentIndex === 0 && menuShift === 0) {
          shiftedMenu = true;
          menuShift = menu.getSize() - MENU_ELEMENTS_MAX;
          layoutGenericMenu.setIndex(MENU_ELEMENTS_MAX - 1);
        }
        break;

      case input.TYPE_DOWN:
        if (currentIndex > MENU_ELEMENTS_MAX - 3 && menuShift < menu.getSize() - MENU_ELEMENTS_MAX) {
          shiftedMenu = true;
          menuShift++;
        } else if (currentIndex === MENU_ELEMENTS_MAX - 1 && menuShift === menu.getSize() - MENU_ELEMENTS_MAX) {
          shiftedMenu = true;
          menuShift = 0;
          layoutGenericMenu.setIndex(0);
        }
        break;
    }
  }

  return (shiftedMenu) ? 2 : (layoutGenericMenu.handleInput(code) === true? 1 : 0);
};

/** */
exports.getMenuIndex = function () {
  return menuShift + layoutGenericMenu.selected;
};

/* ---------------------------------- SUBMODULE: MAP RENDERER ---------------------------------- */

/** */
exports.renderTile = function (x, y) {
  var mapLayer = exports.layerMap;
  var offsetX = exports.screenOffsetX;
  var offsetY = exports.screenOffsetY;

  exports.renderTiles(mapLayer, offsetX, offsetY, x,y,1,1,false);

  // draw overlay of the bottom tile
  if (y < model.mapHeight-1) {
    exports.renderTiles(mapLayer, offsetX, offsetY, x,y+1,1,1,true);
  }
};

/** */
exports.renderTileOverlayRow = function () {
  exports.renderTiles(
      exports.screenOffsetX,
      exports.screenOffsetY,
      exports.screenOffsetX,
      exports.screenOffsetY+1,
      (model.mapWidth < constants.SCREEN_WIDTH) ? model.mapWidth : constants.SCREEN_WIDTH,
      1,
      true
  );
};

/** */
exports.renderTiles = function (x, oy, w, h, overlayDraw) {
  var mapLayer = exports.layerMap;
  var offsetX = exports.screenOffsetX;
  var offsetY = exports.screenOffsetY;

  if (arguments.length === 4) overlayDraw = false;
  var mapData = model.mapData;
  var ctx;
  var scx;
  var scy;
  var scw;
  var sch;
  var tcx;
  var tcy;
  var tcw;
  var tch;
  var tile;
  var sprite, propSprite;
  var state;

  for (var xe = x + w; x < xe; x++) {
    for (var y = oy, ye = y + h; y < ye; y++) {
      tile = mapData[x][y];
      sprite = image.sprites[tile.type.ID].getImage(tile.variant * image.Sprite.TILE_STATES);

      // grab property status before loop (calc it one instead of eight times)
      if (tile.property) {
        if (tile.property.owner) {
          switch (tile.property.owner.id) {
            case 0:
              state = image.Sprite.PROPERTY_RED;
              break;

            case 1:
              state = image.Sprite.PROPERTY_BLUE;
              break;

            case 2:
              state = image.Sprite.PROPERTY_GREEN;
              break;

            case 3:
              state = image.Sprite.PROPERTY_YELLOW;
              break;
          }
        } else {
          state = image.Sprite.PROPERTY_NEUTRAL;
        }

        propSprite = image.sprites[tile.property.type.ID].getImage(state);
      }

      // render all phases
      var n = 0;
      while (n < 8) {
        ctx = mapLayer.getContext(n);

        scx = (image.longAnimatedTiles[tile.type.ID]) ? constants.TILE_BASE * n : 0;
        scy = 0;
        scw = constants.TILE_BASE;
        sch = constants.TILE_BASE * 2;
        tcx = (x - offsetX) * constants.TILE_BASE;
        tcy = (y - offsetY) * constants.TILE_BASE - constants.TILE_BASE;
        tcw = constants.TILE_BASE;
        tch = constants.TILE_BASE * 2;

        if (tcy < 0) {
          scy = scy + constants.TILE_BASE;
          sch = sch - constants.TILE_BASE;
          tcy = tcy + constants.TILE_BASE;
          tch = tch - constants.TILE_BASE;
        }

        if (overlayDraw) {
          sch = sch - constants.TILE_BASE;
          tch = tch - constants.TILE_BASE;
        }

        // render tile
        ctx.drawImage(
            sprite,
            scx, scy,
            scw, sch,
            tcx, tcy,
            tcw, tch
        );

        // render property
        if (tile.property) {
          scx = constants.TILE_BASE * (parseInt(n / 2, 10));

          ctx.drawImage(
              propSprite,
              scx, scy,
              scw, sch,
              tcx, tcy,
              tcw, tch
          );
        }

        n++;
      }
    }
  }
};

/** Note: this one does not clear the layer before action */
exports.shiftTiles = function (code) {
  var mapLayer = exports.layerMap;

  // calculate meta data for shift
  var sx = 0;
  var sy = 0;
  var scx = 0;
  var scy = 0;
  var w = mapLayer.w;
  var h = mapLayer.h;
  switch (code) {
    case move.MOVE_CODES_LEFT:
      scx += constants.TILE_BASE;
      w -= constants.TILE_BASE;
      break;

    case move.MOVE_CODES_RIGHT:
      sx += constants.TILE_BASE;
      w -= constants.TILE_BASE;
      break;

    case move.MOVE_CODES_UP:
      scy += constants.TILE_BASE;
      h -= constants.TILE_BASE;
      break;

    case move.MOVE_CODES_DOWN:
      sy += constants.TILE_BASE;
      h -= constants.TILE_BASE;
      break;
  }

  // update background layers
  var n = 0;
  while (n < 8) {
    mapLayer.getContext(n).drawImage(
        mapLayer.getLayer(n),
        scx, scy,
        w, h,
        sx, sy,
        w, h
    );

    n++;
  }
};

/* ---------------------------------- SUBMODULE: FOCUS RENDERER ---------------------------------- */

/** */
exports.renderFocus = function (x, y, w, h) {
  var ctx;
  var scx;
  var scy;
  var scw;
  var sch;
  var tcx;
  var tcy;
  var tcw;
  var tch;

  var sprite = image.sprites["FOCUS"];
  var spriteImg = sprite.getImage(stateData.focusMode);
  var oy = y;

  for (var xe = x + w; x < xe; x++) {
    for (var y = oy, ye = y + h; y < ye; y++) {

      if (stateData.selection.getValue(x, y) >= 0) {

        // render all phases
        var n = 0;
        while (n < 7) {

          ctx = exports.layerFocus.getContext(n);

          scx = constants.TILE_BASE * n;
          scy = 0;
          scw = constants.TILE_BASE;
          sch = constants.TILE_BASE;
          tcx = (x - exports.screenOffsetX) * constants.TILE_BASE;
          tcy = (y - exports.screenOffsetY) * constants.TILE_BASE;
          tcw = constants.TILE_BASE;
          tch = constants.TILE_BASE;

          ctx.globalAlpha = 0.6;

          ctx.drawImage(
              spriteImg,
              scx, scy,
              scw, sch,
              tcx, tcy,
              tcw, tch
          );

          ctx.globalAlpha = 1;

          n++;
        }
      }
    }
  }
};

/** */
exports.shiftFocus = function (code) {
  var tmpContext = tempCanvas.getContext("2d");

  // calculate meta data for shift
  var sx = 0;
  var sy = 0;
  var scx = 0;
  var scy = 0;
  var w = exports.layerFocus.w;
  var h = exports.layerFocus.h;

  switch (code) {
    case move.MOVE_CODES_LEFT:
      scx += constants.TILE_BASE;
      w -= constants.TILE_BASE;
      break;

    case move.MOVE_CODES_RIGHT:
      sx += constants.TILE_BASE;
      w -= constants.TILE_BASE;
      break;

    case move.MOVE_CODES_UP:
      scy += constants.TILE_BASE;
      h -= constants.TILE_BASE;
      break;

    case move.MOVE_CODES_DOWN:
      sy += constants.TILE_BASE;
      h -= constants.TILE_BASE;
      break;
  }

  // update background layers
  var n = 0;
  while (n < 7) {
    tmpContext.clearRect(0, 0, exports.layerFocus.w, exports.layerFocus.h);

    // copy visible content to temp canvas
    tmpContext.drawImage(
        exports.layerFocus.getLayer(n),
        scx, scy,
        w, h,
        sx, sy,
        w, h
    );

    // clear original canvas
    exports.layerFocus.clear(n);

    // copy visible content back to the original canvas
    exports.layerFocus.getContext(n).drawImage(tempCanvas, 0, 0);

    n++;
  }
};

/* ---------------------------------- SUBMODULE: WEATHER RENDERER ---------------------------------- */

/* Since the time is so low I probably don't need to track it. But it seems memory intensive to pull off,
 * there has to be a less expensive way */

//Keeps track of the frequency of a raindrop
var FREQUENCY = 1;

//Maximum frame wait per particle
var MAX = 8;

//Keeps track of the time
var time;

//Keeps track of delta time
var store;

//Keeps track of the cap
var cap;

//The type of raindrop/snow flake to draw
var type;

//The x-axis position of the raindrop/snow flake
var posx;

//The y-axis position of the raindrop/snow flake
var posy;

var activeGraphic;

var ball;

//Holds the graphics for a simple raindrop (cache). Totally hard coded all the values here
var raindropGfx = document.createElement('canvas');
ball.width = 10;
ball.height = 10;

var raindropCtx = raindropGfx.getContext('2d');
raindropCtx.strokeStyle = "rgba(255,255,255,0.3)";
raindropCtx.lineWidth = 1;
raindropCtx.beginPath();
raindropCtx.moveTo(0, 0);
raindropCtx.lineTo(4, 10);
raindropCtx.stroke();

exports.setWeatherType = function(weather) {
  time = 0;
  store = 0;
  cap = 50;
  type = [];
  posx = [];
  posy = [];
};

exports.updateWeather = function(delta) {

};

exports.renderWeather = function() {
  var ctx = exports.layerEffects.getContext();

  //Tests the speed of each particle for debug mode
  if (constants.DEBUG) time = (new Date()).getTime();

  //Render particles
  for (var i = 0; i < type.length; i++) {
    if (type[i] == -1)
      continue;

    ctx.drawImage(activeGraphic, posx[i], posy[i], 10 + 5 * type[i], 10 + 5 * type[i]);
  }

  //Finishes the testing of speed for snow particles
  if (constants.DEBUG) debug.logFine("Quick render of rain... needed " + ((new Date()).getTime() - time) + "ms");
};
