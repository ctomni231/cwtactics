(function () {

  var canvasW = cwt.TILE_BASE * cwt.SCREEN_WIDTH;
  var canvasH = cwt.TILE_BASE * cwt.SCREEN_HEIGHT;

  /**
   * Screen model.
   *
   * @namespace
   */
  cwt.Screen = {

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
    layerUI: new cwt.LayeredCanvas("canvas_layer6",1,canvasW,canvasH)
  };
})();