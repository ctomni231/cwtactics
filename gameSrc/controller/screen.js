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

    convertToTilePos: function (p) {
      return parseInt(p/cwt.TILE_BASE,10);
    },

    /**
     *
     * @param moveCode
     */
    shiftScreen: function (moveCode) {
      var changed = false;

      switch (moveCode) {
        case cwt.Move.MOVE_CODES_UP:
          if (this.offsetY < cwt.Map.height - cwt.SCREEN_HEIGHT - 1) {
            this.offsetY++;
            changed = true;
          }
          break;

        case cwt.Move.MOVE_CODES_RIGHT:
          if (this.offsetX > 0) {
            this.offsetX--;
            changed = true;
          }
          break;

        case cwt.Move.MOVE_CODES_DOWN:
          if (this.offsetY > 0) {
            this.offsetY--;
            changed = true;
          }
          break;

        case cwt.Move.MOVE_CODES_LEFT:
          if (this.offsetX < cwt.Map.width - cwt.SCREEN_WIDTH - 1) {
            this.offsetX++;
            changed = true;
          }
          break;
      }

      return changed;
    },

    /**
     * @type {cwt.LayeredCanvas}
     */
    layerBG: new cwt.LayeredCanvas("canvas_layer1", 1, canvasW, canvasH),

    /**
     * @type {cwt.LayeredCanvas}
     */
    layerMap: new cwt.LayeredCanvas("canvas_layer2", 8, canvasW, canvasH),

    /**
     * @type {cwt.LayeredCanvas}
     */
    layerFog: new cwt.LayeredCanvas("canvas_layer3", 1, canvasW, canvasH),

    /**
     * @type {cwt.LayeredCanvas}
     */
    layerUnit: new cwt.LayeredCanvas("canvas_layer4", 3, canvasW, canvasH),

    /**
     * @type {cwt.LayeredCanvas}
     */
    layerEffects: new cwt.LayeredCanvas("canvas_layer5", 1, canvasW, canvasH),

    /**
     * @type {cwt.LayeredCanvas}
     */
    layerUI: new cwt.LayeredCanvas("canvas_layer6", 1, canvasW, canvasH)
  };
})();