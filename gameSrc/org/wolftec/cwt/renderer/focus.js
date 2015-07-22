var constants = require("../constants");
var image = require("../image");
var assert = require("../system/functions").assert;
var move = require("../logic/move");

var tempCanvas;

exports.init = function (width, height) {
  assert(!tempCanvas);

  tempCanvas = document.createElement("canvas");
  tempCanvas.width = width;
  tempCanvas.height = height;
};

exports.renderSelection = function (layer, offsetX, offsetY, selection, x, y, w, h, state) {
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
  var spriteImg = sprite.getImage(state);
  var oy = y;

  for (var xe = x + w; x < xe; x++) {
    for (var y = oy, ye = y + h; y < ye; y++) {

      if (selection.getValue(x, y) >= 0) {

        // render all phases
        var n = 0;
        while (n < 7) {

          ctx = layer.getContext(n);

          scx = constants.TILE_BASE * n;
          scy = 0;
          scw = constants.TILE_BASE;
          sch = constants.TILE_BASE;
          tcx = (x - offsetX) * constants.TILE_BASE;
          tcy = (y - offsetY) * constants.TILE_BASE;
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

exports.shift = function (layer, selection, code) {
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
  while (n < 7) {
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