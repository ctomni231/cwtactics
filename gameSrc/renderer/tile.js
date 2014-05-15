cwt.MapRenderer.drawTile = function (x, y, overlayDraw) {
  var tile = cwt.Map.data[x][y];
  var layer = cwt.Screen.layerMap;

  var sprite = cwt.Image.sprites[tile.type.ID].getImage(tile.variant*cwt.Sprite.TILE_STATES);

  // render all phases
  var n = 0;
  while (n < 8) {
    var ctx = layer.getContext(n);

    var scx = (cwt.Image.longAnimatedTiles[tile.type.ID]) ? cwt.TILE_BASE * n : 0;
    var scy = 0;
    var scw = cwt.TILE_BASE;
    var sch = cwt.TILE_BASE * 2;
    var tcx = (x-cwt.Screen.offsetX) * cwt.TILE_BASE;
    var tcy = (y-cwt.Screen.offsetY) * cwt.TILE_BASE - cwt.TILE_BASE;
    var tcw = cwt.TILE_BASE;
    var tch = cwt.TILE_BASE * 2;

    if (tcy < 0) {
      scy = scy + cwt.TILE_BASE;
      sch = sch - cwt.TILE_BASE;
      tcy = tcy + cwt.TILE_BASE;
      tch = tch - cwt.TILE_BASE;
    }

    if (overlayDraw === true) {
      sch = sch - cwt.TILE_BASE;
      tch = tch - cwt.TILE_BASE;
    }

    ctx.drawImage(
      sprite,
      scx, scy,
      scw, sch,
      tcx, tcy,
      tcw, tch
    );

    n++;
  }
};