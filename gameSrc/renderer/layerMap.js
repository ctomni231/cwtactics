/**
 *
 * @param {number} x
 * @param {number} y
 */
cwt.MapRenderer.renderTile = function (x, y) {
  this.renderTiles(x,y,1,1,false);

  // draw overlay of the bottom tile
  if (y < cwt.Map.height-1) {
    this.renderTiles(x,y+1,1,1,true);
  }
};

cwt.MapRenderer.renderTileOverlayRow = function () {
  cwt.MapRenderer.renderTiles(
    cwt.Screen.offsetX,
    cwt.Screen.offsetY+1,
    (cwt.Map.width < cwt.SCREEN_WIDTH) ? cwt.Map.width : cwt.SCREEN_WIDTH,
    1,
    true
  );
};

cwt.MapRenderer.renderTiles = function (x, oy, w, h, overlayDraw) {
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
        scw = cwt.TILE_BASE;
        sch = cwt.TILE_BASE * 2;
        tcx = (x - cwt.Screen.offsetX) * cwt.TILE_BASE;
        tcy = (y - cwt.Screen.offsetY) * cwt.TILE_BASE - cwt.TILE_BASE;
        tcw = cwt.TILE_BASE;
        tch = cwt.TILE_BASE * 2;

        if (tcy < 0) {
          scy = scy + cwt.TILE_BASE;
          sch = sch - cwt.TILE_BASE;
          tcy = tcy + cwt.TILE_BASE;
          tch = tch - cwt.TILE_BASE;
        }

        if (overlayDraw) {
          sch = sch - cwt.TILE_BASE;
          tch = tch - cwt.TILE_BASE;
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
          scx = cwt.TILE_BASE * (parseInt(n / 2, 10));

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

/**
 *
 * Note: this one does not clear the layer before action
 *
 * @param {number} code
 */
cwt.MapRenderer.shiftTiles = function (code) {
  var mapLayer = cwt.Screen.layerMap;

  // calculate meta data for shift
  var sx = 0;
  var sy = 0;
  var scx = 0;
  var scy = 0;
  var w = mapLayer.w;
  var h = mapLayer.h;
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