"use strict";

var constants = require("../constants");
var assert = require("../functions").assert;
var move = require("../logic/move");
var image = require("../image");
var model = require("../model");

var tempCanvas;

exports.init = function (width, height) {
  assert(!tempCanvas);

  tempCanvas = document.createElement("canvas");
  tempCanvas.width = width;
  tempCanvas.height = height;
};

var fixOverlayFog_ = function (x, y, isTop) {
  if (isTop) {

  } else {

  }
};

//
//
// NOTE: clears the area before update
//
// @param x
// @param y
// @param range
//
exports.renderFogCircle = function (layerFog, offsetX, offsetY, x, y, range) {
  exports.renderFogRect(layerFog, offsetX, offsetY, x, y, range, range, true);
};

//
//
// NOTE: clears the area before update
//
// @param x
// @param y
// @param w
// @param h
// @param {boolean?} circle
//
exports.renderFogRect = function (layerFog, offsetX, offsetY, x, y, w, h, circle) {
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
    w += w;
    h += w;

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
        if (!model.isValidPosition(x, y) || distance) {
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

        var scx = (image.longAnimatedTiles[tile.type.ID]) ? constants.TILE_BASE * n : 0;
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

  this.renderFogBackgroundLayer(layerFog);
};

//
//
//
exports.renderFogBackgroundLayer = function (layerFog) {
  layerFog.getContext().globalAlpha = 0.35;
  layerFog.renderLayer(0);
  layerFog.getContext().globalAlpha = 1;
};

//
//
// Note: this one clears the layer before action
//
// @param {number} code
//
exports.shiftFog = function (layer, code) {
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