cwt.MapRenderer.drawUnit = function (x, y) {
  var tile = cwt.Map.data[x][y];
  if (tile.clientVisible === 0) {
    return;
  }

  var unit = tile.unit;
  cwt.assert(unit);

  var layer = cwt.Screen.layerUnit;

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

  if (unit.owner % 2 === 0) {
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
    var tcx = (x-cwt.Screen.offsetX) * cwt.TILE_BASE - cwt.TILE_BASE / 2; // TODO fix scale
    var tcy = (y-cwt.Screen.offsetY) * cwt.TILE_BASE - cwt.TILE_BASE / 2;
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
};