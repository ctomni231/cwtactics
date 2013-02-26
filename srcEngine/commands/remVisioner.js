controller.engineAction({

  name:"removeVision",
  
  key:"RVIS",

  /**
   * Removes a visioner at a given position with a given range.
   *
   * @param {Number} x x coordinate
   * @param {Number} y y coordinate
   * @param {Number} range vision range of the visioner
   *
   * @methodOf controller.actions
   * @name removeVision
   */
  action: function( x,y, range ){
    if( model.rules.fogEnabled === false ){
      return;
    }
  
    var lX;
    var hX;
    var lY = y-range;
    var hY = y+range;
    if( lY < 0 ) lY = 0;
    if( hY >= model.mapHeight ) hY = model.mapHeight-1;
    for( ; lY<=hY; lY++ ){
  
      var disY = Math.abs( lY-y );
      lX = x-range+disY;
      hX = x+range-disY;
      if( lX < 0 ) lX = 0;
      if( hX >= model.mapWidth ) hX = model.mapWidth-1;
      for( ; lX<=hX; lX++ ){
        
        model.fogData[lX][lY]--;
      }
    }
  }
});