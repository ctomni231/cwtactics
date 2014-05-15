cwt.MapRenderer.updateScreen = function () {
  var time;

  if (cwt.DEBUG) {
    time = (new Date()).getTime();
  }

  for (var x = cwt.Screen.offsetX, xe = cwt.Screen.offsetX+cwt.SCREEN_WIDTH; x < xe; x++) {
    for (var y = cwt.Screen.offsetY, ye = cwt.Screen.offsetY+cwt.SCREEN_HEIGHT; y < ye; y++) {
      if (cwt.Map.isValidPosition(x, y)) {
        this.drawTile(x, y);

        var tile = cwt.Map.data[x][y];
        if (tile.property) {
          this.drawProperty(x, y);
        }

        if (tile.unit) {
          this.drawUnit(x, y);
        }
      }
    }
  }

  if (cwt.DEBUG) {
    console.log("Rendered complete screen, needed "+((new Date()).getTime()-time)+"ms");
  }
};

cwt.MapRenderer.updateScreenShift = function (code) {
  var time;

  if (cwt.DEBUG) {
    time = (new Date()).getTime();
  }

  var mapLayer = cwt.Screen.layerMap;

  var sx = 0;
  var sy = 0;
  var scx = 0;
  var scy = 0;
  var w =  mapLayer.w;
  var h =  mapLayer.h;

  // calculate canvas meta data for shifting
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

  // grab reusable content of the layers and render it shifted into self
  var n = 0;
  while (n < 8) {

    mapLayer.getContext(n).drawImage(
      mapLayer.getLayer(n),
      scx,scy,
      w,h,
      sx,sy,
      w,h
    )

    n++;
  }

  // shift screen in model
  var lx,ly,ex,ey;
  var overlayFix = false;
  switch (code) {
    case cwt.Move.MOVE_CODES_LEFT:
      lx = cwt.SCREEN_WIDTH-1;
      ex = cwt.SCREEN_WIDTH;
      ly = 0;
      ey = cwt.SCREEN_HEIGHT;
      break;

    case cwt.Move.MOVE_CODES_RIGHT:
      lx = 0;
      ex = 1;
      ly = 0;
      ey = cwt.SCREEN_HEIGHT;
      break;

    case cwt.Move.MOVE_CODES_UP:
      lx = 0;
      ex = cwt.SCREEN_WIDTH;
      ly = cwt.SCREEN_HEIGHT-1;
      ey = cwt.SCREEN_HEIGHT;
      break;

    case cwt.Move.MOVE_CODES_DOWN:
      lx = 0;
      ex = cwt.SCREEN_WIDTH;
      ly = 0;
      ey = 1;
      overlayFix = true;
      break;
  }

  lx += cwt.Screen.offsetX;
  ex += cwt.Screen.offsetX;
  ly += cwt.Screen.offsetY;
  ey += cwt.Screen.offsetY;

  // re-render the row/column that came from offscreen into the screen
  var oy = ly;
  var ox = lx;
  for (;lx<ex;lx++) {
    for (ly = oy;ly<ey;ly++) {
      if (cwt.Map.isValidPosition(lx, ly)) {
        this.drawTile(lx, ly);

        var tile = cwt.Map.data[lx][ly];
        if (tile.property) {
          this.drawProperty(lx, ly);
        }
      }
    }
  }

  // fix overlay parts of the row 1 (screen)
  if (overlayFix) {
    for (;ox<ex; ox++) {
      this.drawTile(ox,oy+1,true);
      if (cwt.Map.data[ox][oy+1].property) {
        this.drawProperty(ox,oy+1,true);
      }
    }
  }

  // rerender unit layer completely
  cwt.Screen.layerUnit.clearAll();
  for (var x = cwt.Screen.offsetX, xe = cwt.Screen.offsetX+cwt.SCREEN_WIDTH; x < xe; x++) {
    for (var y = cwt.Screen.offsetY, ye = cwt.Screen.offsetY+cwt.SCREEN_HEIGHT; y < ye; y++) {
      if (cwt.Map.isValidPosition(x, y)) {
        var tile = cwt.Map.data[x][y];
        if (tile.unit) {
          this.drawUnit(x, y);
        }
      }
    }
  }

  cwt.Screen.layerMap.renderLayer(this.indexMapAnimation);
  cwt.Screen.layerUnit.renderLayer(this.indexUnitAnimation);

  if (cwt.DEBUG) {
    console.log("Shifted screen, needed "+((new Date()).getTime()-time)+"ms");
  }
};