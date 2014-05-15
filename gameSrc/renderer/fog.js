cwt.MapRenderer.drawFog = function () {
  var time;

  if (cwt.DEBUG) {
    time = (new Date()).getTime();
  }

  var data = cwt.Map.data;
  var layer = cwt.Screen.layerFog.getContext(0);

  for (var x = cwt.Screen.offsetX, xe = cwt.Screen.offsetX+cwt.SCREEN_WIDTH; x < xe; x++) {
    for (var y = cwt.Screen.offsetY, ye = cwt.Screen.offsetY+cwt.SCREEN_HEIGHT; y < ye; y++) {
      if (data[x][y].visionClient === 0) {

        var sprite = null;
        if (data[x][y].property) {
          sprite = cwt.Image.sprites[data[x][y].property.type.ID].getImage(cwt.Sprite.PROPERTY_SHADOW_MASK);
        } else {
          sprite = cwt.Image.sprites[data[x][y].type.ID].getImage(
            data[x][y].variant*cwt.Sprite.TILE_STATES+cwt.Sprite.TILE_SHADOW);
        }

        var scx = (cwt.Image.longAnimatedTiles[data[x][y].type.ID]) ? cwt.TILE_BASE * n : 0;
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

        layer.drawImage(
          sprite,
          scx,scy,
          scw,sch,
          tcx,tcy,
          tcw,tch
        );
      }
    }
  }

  cwt.Screen.layerFog.getContext().globalAlpha = 0.35;
  cwt.Screen.layerFog.renderLayer(0);
  cwt.Screen.layerFog.getContext().globalAlpha = 1;

  if (cwt.DEBUG) {
    console.log("Rendered fog, needed "+((new Date()).getTime()-time)+"ms");
  }
};