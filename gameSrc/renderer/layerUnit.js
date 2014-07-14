//
//
// NOTE: does not clear the area before update
//
// @param {number} x
// @param {number} y
// @param {number} w
// @param {number} h
//
cwt.MapRenderer.renderUnits = function (x, oy, w, h) {
  var mapData = cwt.Map.data;
  var layer = cwt.Screen.layerUnit;
  var halfTileBase = parseInt(cwt.TILE_BASE / 2,10);

  for (var xe = x + w; x < xe; x++) {
    for (var y = oy, ye = y + h; y < ye; y++) {
      var tile = mapData[x][y];
      if (tile.visionClient === 0) continue;

      var unit = tile.unit;
      if (!unit) continue;

      var state;
      switch (unit.owner.id) {
        case 0:
          state = cwt.Sprite.UNIT_RED;
          break;

        case 1:
          state = cwt.Sprite.UNIT_BLUE;
          break;

        case 2:
          state = cwt.Sprite.UNIT_GREEN;
          break;

        case 3:
          state = cwt.Sprite.UNIT_YELLOW;
          break;
      }

      // inverted ?
      if (unit.owner.id % 2 === 0) {
        state += cwt.Sprite.UNIT_STATE_IDLE_INVERTED;
      }

      var sprite = cwt.Image.sprites[unit.type.ID].getImage(state);
      var n = 0;
      while (n < 3) {
        var ctx = layer.getContext(n);

        var scx = (cwt.TILE_BASE * 2) * n;
        var scy = 0;
        var scw = cwt.TILE_BASE * 2;
        var sch = cwt.TILE_BASE * 2;
        var tcx = (x-cwt.Screen.offsetX) * cwt.TILE_BASE - halfTileBase;
        var tcy = (y-cwt.Screen.offsetY) * cwt.TILE_BASE - halfTileBase;
        var tcw = cwt.TILE_BASE + cwt.TILE_BASE;
        var tch = cwt.TILE_BASE + cwt.TILE_BASE;

        ctx.drawImage(
          sprite,
          scx, scy,
          scw, sch,
          tcx, tcy,
          tcw, tch
        );

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
cwt.MapRenderer.shiftUnits = function (code) {
  var layer = cwt.Screen.layerUnit;
  var tmpCanvas = this.getTempCanvas();
  var tmpContext = tmpCanvas.getContext("2d");

  // calculate meta data for shift
  var sx = 0;
  var sy = 0;
  var scx = 0;
  var scy = 0;
  var w = layer.w;
  var h = layer.h;
  switch (code) {
    case cwt.Move.MOVE_CODES_LEFT:
      scx += cwt.TILE_BASE;
      w -= cwt.TILE_BASE;
      break;

    case cwt.Move.MOVE_CODES_RIGHT:
      sx += cwt.TILE_BASE;
      w -= cwt.TILE_BASE;
      break;

    case cwt.Move.MOVE_CODES_UP:
      scy += cwt.TILE_BASE;
      h -= cwt.TILE_BASE;
      break;

    case cwt.Move.MOVE_CODES_DOWN:
      sy += cwt.TILE_BASE;
      h -= cwt.TILE_BASE;
      break;
  }

  // update background layers
  var n = 0;
  while (n < 3) {
    tmpContext.clearRect(0,0,layer.w,layer.h);

    // copy visible content to temp canvas
    tmpContext.drawImage(
      layer.getLayer(n),
      scx, scy,
      w, h,
      sx, sy,
      w, h
    )

    // clear original canvas
    layer.clear(n);

    // copy visible content back to the original canvas
    layer.getContext(n).drawImage(tmpCanvas,0,0);

    n++;
  }
};