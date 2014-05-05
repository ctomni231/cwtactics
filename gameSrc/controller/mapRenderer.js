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

    var sprite = cwt.Image.sprites[tile.type.ID];

    // render all phases
    var n = 0;
    while (n < 8) {
      var ctx = layer.getContext(n);

      var scx = (cwt.Image.longAnimatedTiles[tile.type.ID])? cwt.TILE_BASE*n : 0;
      var scy = 0;
      var scw = cwt.TILE_BASE;
      var sch = cwt.TILE_BASE*2;
      var tcx = (x)*cwt.TILE_BASE;
      var tcy = (y)*cwt.TILE_BASE - cwt.TILE_BASE;
      var tcw = cwt.TILE_BASE;
      var tch = cwt.TILE_BASE*2;

      if( tcy < 0 ){
        scy = scy + cwt.TILE_BASE;
        sch = sch - cwt.TILE_BASE;
        tcy = tcy + cwt.TILE_BASE;
        tch = tch - cwt.TILE_BASE;
      }

      ctx.drawImage(
        sprite.getImage(tile.variant),
        scx,scy,
        scw,sch,
        tcx,tcy,
        tcw,tch
      );

      n++;
    }
  },

  drawProperty: function (x, y) {

  },

  drawUnit: function (x, y) {

  },

  updateScreen: function () {
    for (var x = 0, xe = cwt.SCREEN_WIDTH; x < xe; x++) {
      for (var y = 0, ye = cwt.SCREEN_HEIGHT; y < ye; y++) {
        if (cwt.Map.isValidPosition(x, y)) {
          this.drawTile(x, y);
        }
      }
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