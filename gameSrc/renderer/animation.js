//
//
var unitAnimationHalfStep = false;

//
//
var curTime = 0;

//
//
exports.indexUnitAnimation = 0;

//
//
exports.indexMapAnimation = 0;

//
//
exports.indexEffectAnimation = 0;

//
//
exports.evaluateCycle = function (delta, layerUnit, layerMap, layerFocus) {
  var index;

  curTime += delta;
  if (curTime > 150) {
    curTime = 0;

    // calc unit animation layer step
    unitAnimationHalfStep = !unitAnimationHalfStep;
    if (!unitAnimationHalfStep) {

      index = exports.indexUnitAnimation + 1;
      if (index === 3) {
        index = 0;
      }

      // render unit animation layer
      layerUnit.renderLayer(index);
      exports.indexUnitAnimation = index;
    }

    // map animation layer
    index = exports.indexMapAnimation + 1;
    if (index === 8) {
      index = 0;
    }

    // render map animation layer
    layerMap.renderLayer(index);
    exports.indexMapAnimation = index;

    // effect animation layer
    index = exports.indexEffectAnimation + 1;
    if (index === 7) {
      index = 0;
    }

    // render map animation layer
    layerFocus.renderLayer(index);
    exports.indexEffectAnimation = index;
  }
};
