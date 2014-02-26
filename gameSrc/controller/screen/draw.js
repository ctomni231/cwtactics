/**
 * @namespace
 */
cwt.Draw = {
  
  drawTile: function (x, y, tile, step) {
    
  },
    
  drawProperty: function (x, y, property, step) {
    
  },
    
  drawPropertyGray: function (x, y, property, step) {
    // property in shadow
  },
  
  drawUnit: function (x, y, unit, step)  {
    
  },
  
  drawCursor: function (x, y, step) {
    
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
