//
//
var unitAnimationHalfStep = false;

//
//
var curTime = 0;

//
//
var indexUnitAnimation = 0;

//
//
var indexMapAnimation = 0;

//
//
exports.evaluateCycle = function (delta, layerUnit, layerMap) {
  var index;

  curTime += delta;
  if (curTime > 150) {
    curTime = 0;

    // calc unit animation layer step
    unitAnimationHalfStep = !unitAnimationHalfStep;
    if (!unitAnimationHalfStep) {

      index = this.indexUnitAnimation + 1;
      if (index === 3) {
        index = 0;
      }

      // render unit animation layer
      layerUnit.renderLayer(index);
      indexUnitAnimation = index;
    }

    // map animation layer
    index = this.indexMapAnimation + 1;
    if (index === 8) {
      index = 0;
    }

    // render map animation layer
    layerMap.renderLayer(index);
    indexMapAnimation = index;
  }
};
