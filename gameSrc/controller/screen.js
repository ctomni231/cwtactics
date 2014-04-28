(function () {

  var canvasW = cwt.TILE_BASE * cwt.SCREEN_WIDTH;
  var canvasH = cwt.TILE_BASE * cwt.SCREEN_HEIGHT;
  /**
   * Screen model.
   *
   * @namespace
   */
  cwt.Screen = {

    /**
     * @private
     */
    unitAnimationHalfStep_: false,

    /**
     * @private
     */
    curTime_: 0,

    width: canvasW,

    height: canvasH,

    offsetX: 0,

    offsetY: 0,

    /**
     * @type {cwt.LayeredCanvas}
     */
    layerBG: new cwt.LayeredCanvas("canvas_layer1",1,canvasW,canvasH),

    /**
     * @type {cwt.LayeredCanvas}
     */
    layerMap: new cwt.LayeredCanvas("canvas_layer2",8,canvasW,canvasH),

    /**
     * @type {cwt.LayeredCanvas}
     */
    layerFog: new cwt.LayeredCanvas("canvas_layer3",1,canvasW,canvasH),

    /**
     * @type {cwt.LayeredCanvas}
     */
    layerUnit: new cwt.LayeredCanvas("canvas_layer4",3,canvasW,canvasH),

    /**
     * @type {cwt.LayeredCanvas}
     */
    layerEffects: new cwt.LayeredCanvas("canvas_layer5",1,canvasW,canvasH),

    /**
     * @type {cwt.LayeredCanvas}
     */
    layerUI: new cwt.LayeredCanvas("canvas_layer6",1,canvasW,canvasH),

    indexUnitAnimation: 0,

    indexMapAnimation: 0,

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
          this.layerUnit.renderLayer(index);
          this.indexUnitAnimation = index;
        }

        // map animation layer
        index = this.indexMapAnimation + 1;
        if (index === 8) {
          index = 0;
        }

        // render map animation layer
        this.layerMap.renderLayer(index);
        this.indexMapAnimation = index;
      }
    }
  };
})();