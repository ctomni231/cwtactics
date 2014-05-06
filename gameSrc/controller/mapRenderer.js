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

  drawTile: function (x, y) {
    var tile = cwt.Map.data[x][y];
    var layer = cwt.Screen.layerMap;

    var sprite = cwt.Image.sprites[tile.type.ID].getImage(tile.variant);

    // render all phases
    var n = 0;
    while (n < 8) {
      var ctx = layer.getContext(n);

      var scx = (cwt.Image.longAnimatedTiles[tile.type.ID]) ? cwt.TILE_BASE * n : 0;
      var scy = 0;
      var scw = cwt.TILE_BASE;
      var sch = cwt.TILE_BASE * 2;
      var tcx = (x) * cwt.TILE_BASE;
      var tcy = (y) * cwt.TILE_BASE - cwt.TILE_BASE;
      var tcw = cwt.TILE_BASE;
      var tch = cwt.TILE_BASE * 2;

      if (tcy < 0) {
        scy = scy + cwt.TILE_BASE;
        sch = sch - cwt.TILE_BASE;
        tcy = tcy + cwt.TILE_BASE;
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

  drawProperty: function (x, y) {
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
      var tcx = (x) * cwt.TILE_BASE;
      var tcy = (y) * cwt.TILE_BASE - cwt.TILE_BASE;
      var tcw = cwt.TILE_BASE;
      var tch = cwt.TILE_BASE * 2;

      if (tcy < 0) {
        scy = scy + cwt.TILE_BASE;
        sch = sch - cwt.TILE_BASE;
        tcy = tcy + cwt.TILE_BASE;
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
    var unit = cwt.Map.data[x][y].unit;
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
      var tcx = (x) * cwt.TILE_BASE - cwt.TILE_BASE / 2; // TODO fix scale
      var tcy = (y) * cwt.TILE_BASE - cwt.TILE_BASE / 2;
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

  updateScreen: function () {
    var time;

    if (cwt.DEBUG) {
      time = (new Date()).getTime();
    }

    for (var x = 0, xe = cwt.SCREEN_WIDTH; x < xe; x++) {
      for (var y = 0, ye = cwt.SCREEN_HEIGHT; y < ye; y++) {
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