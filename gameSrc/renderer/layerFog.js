/**
 *
 * NOTE: clears the area before update
 *
 * @param x
 * @param y
 * @param range
 */
cwt.MapRenderer.renderFogCircle = function (x, y, range) {
  this.renderFogRect(x, y, range, range, true);
};

/**
 *
 * NOTE: clears the area before update
 *
 * @param x
 * @param y
 * @param w
 * @param h
 * @param {boolean?} circle
 */
cwt.MapRenderer.renderFogRect = function (x, y, w, h, circle) {
  if (arguments.length === 4) circle = false;
  var data = cwt.Map.data;
  var layer = cwt.Screen.layerFog.getContext(0);
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
      (x - cwt.Screen.offsetX) * cwt.TILE_BASE,
      (y - cwt.Screen.offsetY) * cwt.TILE_BASE,
      w * cwt.TILE_BASE,
      h * cwt.TILE_BASE
    );
  }

  // render
  var oy = y;
  for (var xe = x + w; x < xe; x++) {
    y = oy;
    for (var ye = y + h; y < ye; y++) {
      var distance;

      if (circle) {
        distance = cwt.Map.getDistance(x, y, cx, cy);
        if (!cwt.Map.isValidPosition(x, y) || distance) {
          continue;
        }

        // clear position
        layer.clearRect(
          (x - cwt.Screen.offsetX) * cwt.TILE_BASE,
          (y - cwt.Screen.offsetY) * cwt.TILE_BASE,
          cwt.TILE_BASE,
          cwt.TILE_BASE
        );
      }

      var tile = data[x][y];
      if (tile.visionClient === 0) {

        var sprite = null;
        if (tile.property) {
          sprite = cwt.Image.sprites[tile.property.type.ID].getImage(
            cwt.Sprite.PROPERTY_SHADOW_MASK
          );
        } else {
          sprite = cwt.Image.sprites[tile.type.ID].getImage(
            tile.variant * cwt.Sprite.TILE_STATES + cwt.Sprite.TILE_SHADOW
          );
        }

        var scx = (cwt.Image.longAnimatedTiles[tile.type.ID]) ? cwt.TILE_BASE * n : 0;
        var scy = 0;
        var scw = cwt.TILE_BASE;
        var sch = cwt.TILE_BASE * 2;
        var tcx = (x - cwt.Screen.offsetX) * cwt.TILE_BASE;
        var tcy = (y - cwt.Screen.offsetY) * cwt.TILE_BASE - cwt.TILE_BASE;
        var tcw = cwt.TILE_BASE;
        var tch = cwt.TILE_BASE * 2;

        if (tcy < 0) {
          scy = scy + cwt.TILE_BASE;
          sch = sch - cwt.TILE_BASE;
          tcy = tcy + cwt.TILE_BASE;
          tch = tch - cwt.TILE_BASE;
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
              this.fixOverlayFog_(x, y, true);
            }

            // bottom check
            if (y >= cy) {
              this.fixOverlayFog_(x, y, false);
            }
          }
        }
      }
    }
  }

  // fix overlay top and bottom in the rectangle mode
  if (!circle) {

  }

  this.renderFogBackgroundLayer();
};

cwt.MapRenderer.fixOverlayFog_ = function (x, y, isTop) {
  if (isTop) {

  } else {

  }
};

/**
 *
 */
cwt.MapRenderer.renderFogBackgroundLayer = function () {
  cwt.Screen.layerFog.getContext().globalAlpha = 0.35;
  cwt.Screen.layerFog.renderLayer(0);
  cwt.Screen.layerFog.getContext().globalAlpha = 1;
};

/**
 *
 * Note: this one clears the layer before action
 *
 * @param {number} code
 */
cwt.MapRenderer.shiftFog = function (code) {
  var layer = cwt.Screen.layerFog;
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

  tmpContext.clearRect(0, 0, layer.w, layer.h);

  // copy visible content to temp canvas
  tmpContext.drawImage(
    layer.getLayer(0),
    scx, scy,
    w, h,
    sx, sy,
    w, h
  )

  // clear original canvas
  layer.clear(0);

  // copy visible content back to the original canvas
  layer.getContext(0).drawImage(tmpCanvas, 0, 0);

  this.renderFogBackgroundLayer();
};