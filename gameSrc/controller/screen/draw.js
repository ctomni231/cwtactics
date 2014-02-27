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
  
  drawCursor: function (x, y, step) {

  },

  drawFogToTile: function (x, y, tile) {

  },

  clearFogFromTile: function (x, y, tile) {

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
