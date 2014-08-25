var constants = require("../constants");
var assert = require("../system/functions").assert;
var model = require("../model");
var image = require("../image");
var move = require("../logic/move");

var tempCanvas;

exports.hiddenUnitId = constants.INACTIVE;

exports.init = function(width, height) {
  assert(!tempCanvas);

  tempCanvas = document.createElement("canvas");
  tempCanvas.width = width;
  tempCanvas.height = height;
};

//
//
// NOTE: does not clear the area before update
//
// @param {number} x
// @param {number} y
// @param {number} w
// @param {number} h
//
exports.renderUnits = function(layer, offsetX, offsetY, x, oy, w, h) {
  var mapData = model.mapData;
  var halfTileBase = parseInt(constants.TILE_BASE / 2, 10);
  var hiddenUnit = (exports.hiddenUnitId !== constants.INACTIVE ? model.units[exports.hiddenUnitId] : null);

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
        var tcx = (x - offsetX) * constants.TILE_BASE - halfTileBase;
        var tcy = (y - offsetY) * constants.TILE_BASE - halfTileBase;
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

//
//
// Note: this one clears the layer before action
//
// @param {number} code
//
exports.shiftUnits = function(layer, code) {
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