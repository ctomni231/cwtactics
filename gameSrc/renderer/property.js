cwt.MapRenderer.drawProperty = function (x, y, overlayDraw) {
  var property = cwt.Map.data[x][y].property;
  cwt.assert(property);

  var layer = cwt.Screen.layerMap;

  var state;
  if (property.owner) {
    switch (property.owner.id) {
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


  var sprite = cwt.Image.sprites[property.type.ID].getImage(state);

  // render all phases
  var n = 0;
  while (n < 8) {
    var ctx = layer.getContext(n);

    var scx = cwt.TILE_BASE * (parseInt(n/2,10));
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