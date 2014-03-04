/**
 * This class builds a nice facade around the rendering system. If you call a function here, all frames will be
 * rendered automatically, which means you have not to make sure everything is correct in every layer.
 *
 * @namespace
 */
cwt.Draw = {
  
  drawTile: function (x, y, tile, step) {
    // 8 layers
  },
    
  drawProperty: function (x, y, property, step) {
    // 8 layers
  },
    
  drawPropertyGray: function (x, y, property, step) {
    // property in shadow
    // 8 layers
  },
  
  drawUnit: function (x, y, unit, step)  {
    // 4 layers
  },

  cleanCursor: function () {
    var base = cwt.Screen.TILE_BASE;
    var hBase = parseInt(base/2,10);
    var layer = cwt.Screen.interfaceLayer;
    var drawCtx = layer.getContext(0);

    drawCtx.clearRect(
      cwt.Cursor.x*base-hBase,
      cwt.Cursor.y*base-hBase,
      base,
      base
    );
  },
  
  drawCursor: function (step) {
    var base = cwt.Screen.TILE_BASE;
    var hBase = parseInt(base/2,10);
    var dBase = base*2;
    var layer = cwt.Screen.interfaceLayer;
    var drawCtx = layer.getContext(0);
    var sprite = cwt.Image.sprites["cursor"];

    drawCtx.drawImage(
      sprite.getImageFor(cwt.Image.CODE_STATELESS),

      sprite.ox*base-hBase,
      sprite.oy*base-hBase,
      dBase,
      dBase,

      cwt.Cursor.x*base-hBase,
      cwt.Cursor.y*base-hBase,
      dBase,
      dBase
    );
  },

  drawFogToTile: function (x, y, tile) {
    var base = cwt.Screen.TILE_BASE;
    var layer = cwt.Screen.fogLayer;
    var drawCtx = layer.getContext(0);

  },

  clearFogFromTile: function (x, y, tile) {
    var base = cwt.Screen.TILE_BASE;
    var layer = cwt.Screen.fogLayer;
    var drawCtx = layer.getContext(0);

    drawCtx.clearRect(x*base, y*base, base, base);
  },
  
  drawMapLayer: function () {
    
  },
    
  drawFogLayer: function () {
    // overlay all foggy tiles here
  },
  
  drawUnitLayer: function () {
    // render all units here
  },
    
  drawScreen: function () {
    this.drawMapLayer();
    this.drawFogLayer();
    this.drawUnitLayer();
  }
};
