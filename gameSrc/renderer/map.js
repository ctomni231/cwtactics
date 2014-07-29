var constants = require("../constants");
var move = require("../logic/move");
var model = require("../model");

//
//
// @param {number} x
// @param {number} y
//
exports.renderTile = function (x, y) {
  this.renderTiles(x,y,1,1,false);

  // draw overlay of the bottom tile
  if (y < model.mapHeight-1) {
    this.renderTiles(x,y+1,1,1,true);
  }
};

exports.renderTileOverlayRow = function () {
  exports.renderTiles(
    cwt.Screen.offsetX,
    cwt.Screen.offsetY+1,
    (cwt.Map.width < cwt.SCREEN_WIDTH) ? model.mapWidth : cwt.SCREEN_WIDTH,
    1,
    true
  );
};

exports.renderTiles = function (x, oy, w, h, overlayDraw) {
  if (arguments.length === 4) overlayDraw = false;
  var mapData = cwt.Map.data;
  var mapLayer = cwt.Screen.layerMap;
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
      sprite = cwt.Image.sprites[tile.type.ID].getImage(tile.variant * cwt.Sprite.TILE_STATES);

      // grab property status before loop (calc it one instead of eight times)
      if (tile.property) {
        if (tile.property.owner) {
          switch (tile.property.owner.id) {
            case 0:
              state = cwt.Sprite.PROPERTY_RED;
              break;

            case 1:
              state = cwt.Sprite.PROPERTY_BLUE;
              break;

            case 2:
              state = cwt.Sprite.PROPERTY_GREEN;
              break;

            case 3:
              state = cwt.Sprite.PROPERTY_YELLOW;
              break;
          }
        } else {
          state = cwt.Sprite.PROPERTY_NEUTRAL;
        }

        propSprite = cwt.Image.sprites[tile.property.type.ID].getImage(state);
      }

      // render all phases
      var n = 0;
      while (n < 8) {
        ctx = mapLayer.getContext(n);

        scx = (cwt.Image.longAnimatedTiles[tile.type.ID]) ? cwt.TILE_BASE * n : 0;
        scy = 0;
        scw = constants.TILE_BASE;
        sch = constants.TILE_BASE * 2;
        tcx = (x - cwt.Screen.offsetX) * constants.TILE_BASE;
        tcy = (y - cwt.Screen.offsetY) * constants.TILE_BASE - constants.TILE_BASE;
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

//
//
// Note: this one does not clear the layer before action
//
// @param {number} code
//
exports.shiftTiles = function (code) {
  var mapLayer = cwt.Screen.layerMap;

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
    )

    n++;
  }
};