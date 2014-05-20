/**
 * @private
 */
cwt.MapRenderer.unitAnimationHalfStep_ = false;

/**
 * @private
 */
cwt.MapRenderer.curTime_ = 0;

/**
 * @readonly
 * @type number
 */
cwt.MapRenderer.indexUnitAnimation = 0;

/**
 * @readonly
 * @type number
 */
cwt.MapRenderer.indexMapAnimation = 0;

/**
 *
 * @param {number} delta
 */
cwt.MapRenderer.evaluateCycle = function (delta) {
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
};
