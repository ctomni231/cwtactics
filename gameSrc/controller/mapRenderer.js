cwt.MapRenderer = {

  /**
   * @private
   */
  unitAnimationHalfStep_: false,

  /**
   * @private
   */
  curTime_: 0,

  /**
   * @readonly
   * @type number
   */
  indexUnitAnimation: 0,

  /**
   * @readonly
   * @type number
   */
  indexMapAnimation: 0,

  drawTile: function (x, y, overlayDraw) {
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
  },

  drawProperty: function (x, y, overlayDraw) {
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
  },

  drawUnit: function (x, y) {
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
  },

  /**
   * Erases the cursor to the UI layer.
   */
  eraseCursor: function () {
    var ui = cwt.Screen.layerUI;
    var h = cwt.TILE_BASE / 2;

    ui.getContext().clearRect(
      (cwt.Cursor.x - cwt.Screen.offsetX - 1) * cwt.TILE_BASE,
      (cwt.Cursor.y - cwt.Screen.offsetY - 1) * cwt.TILE_BASE,
      cwt.TILE_BASE * 3,
      cwt.TILE_BASE * 3
    );
  },

  /**
   * Renders the cursor to the UI layer.
   */
  drawCursor: function () {
    var ctx = cwt.Screen.layerUI.getContext();
    var cursorImg = cwt.Image.sprites.CURSOR.getImage(0);

    var h = cwt.TILE_BASE / 2;
    var x = (cwt.Cursor.x - cwt.Screen.offsetX) * cwt.TILE_BASE;
    var y = (cwt.Cursor.y - cwt.Screen.offsetY) * cwt.TILE_BASE;

    ctx.drawImage(cursorImg, x - h, y - h);
    ctx.drawImage(cursorImg, x + h + h, y + h + h);
    ctx.drawImage(cursorImg, x + h + h, y - h);
    ctx.drawImage(cursorImg, x - h, y + h + h);
  },
  
  drawFog: function () {
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
  },

  updateScreenShift: function (code) {
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
  },

  updateScreen: function () {
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
  },

  /**
   *
   * @param delta
   */
  renderCycle: function (delta) {
    var index;

    this.curTime_ += delta;
    if (this.curTime_ > 150) {
      this.curTime_ = 0;

      // calc unit animation layer step
      this.unitAnimationHalfStep_ = !this.unitAnimationHalfStep_;
      if (!this.unitAnimationHalfStep_) {

        index = this.indexUnitAnimation + 1;
        if (index === 3) {
          index = 0;
        }

        // render unit animation layer
        cwt.Screen.layerUnit.renderLayer(index);
        this.indexUnitAnimation = index;
      }

      // map animation layer
      index = this.indexMapAnimation + 1;
      if (index === 8) {
        index = 0;
      }

      // render map animation layer
      cwt.Screen.layerMap.renderLayer(index);
      this.indexMapAnimation = index;
    }
  }
};
