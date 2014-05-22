/**
 *
 */
cwt.MapRenderer.renderScreen = function () {
  var time;
  if (cwt.DEBUG) time = (new Date()).getTime();

  var x = cwt.Screen.offsetX;
  var y = cwt.Screen.offsetY;
  var w = (cwt.Map.width < cwt.SCREEN_WIDTH)? cwt.Map.width : cwt.SCREEN_WIDTH;
  var h = (cwt.Map.height < cwt.SCREEN_HEIGHT)? cwt.Map.height : cwt.SCREEN_HEIGHT;

  this.renderTiles(x, y, w, h);
  this.renderUnits(x, y, w, h);

  // directly update all layers
  cwt.Screen.layerMap.renderLayer(this.indexMapAnimation);
  cwt.Screen.layerUnit.renderLayer(this.indexUnitAnimation);

  this.renderFogRect(x, y, w, h);

  if (cwt.DEBUG) console.log("rendered the complete screen (" + ((new Date()).getTime() - time) + "ms)");
};

/**
 *
 * @param {number} code
 */
cwt.MapRenderer.shiftMap = function (code) {
  var time;
  if (cwt.DEBUG) time = (new Date()).getTime();

  var fx = cwt.Screen.offsetX;
  var fy = cwt.Screen.offsetY;
  var fw = cwt.SCREEN_WIDTH;
  var fh = cwt.SCREEN_HEIGHT;

  // extract needed data for the shift process
  switch (code) {
    case cwt.Move.MOVE_CODES_LEFT:
      fx += cwt.SCREEN_WIDTH - 1;
      fw = 1;
      break;

    case cwt.Move.MOVE_CODES_RIGHT:
      fw = 1;
      break;

    case cwt.Move.MOVE_CODES_UP:
      fy += cwt.SCREEN_HEIGHT - 1;
      fh = 1;
      break;

    case cwt.Move.MOVE_CODES_DOWN:
      fh = 1;
      break;
  }

  // shift screen
  this.shiftTiles(code);
  this.shiftUnits(code);
  this.shiftFog(code);

  // fill created hole
  this.renderTiles(fx, fy, fw, fh);
  this.renderUnits(fx, fy, fw, fh);
  this.renderFogRect(fx, fy, fw, fh);

  // fix overlay when screen moves down
  if (code === cwt.Move.MOVE_CODES_DOWN) {
    this.renderTileOverlayRow();
  }

  // directly update all layers
  cwt.Screen.layerMap.renderLayer(this.indexMapAnimation);
  cwt.Screen.layerUnit.renderLayer(this.indexUnitAnimation);

  if (cwt.DEBUG) console.log("shifted the screen (" + ((new Date()).getTime() - time) + "ms)");
};