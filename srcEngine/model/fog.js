/**
 * Contains the fog data map. A value 0 means a tile is not visible. A value
 * greater than 0 means it is visible for n units ( n = fog value of the tile ). 
 */
model.fogData = util.matrix( 
  CWT_MAX_MAP_WIDTH, 
  CWT_MAX_MAP_HEIGHT, 
  0 
);

util.scoped(function(){
  
  function modifyVisionAt( x,y, pid, range, value ){
    if( !controller.configValue("fogEnabled") ) return;
    
    controller.prepareTags( x, y );
    range = controller.scriptedValue( pid,"vision", range );
    
    var mH = model.mapHeight;
    var mW = model.mapWidth;
    
    var lX;
    var hX;
    var lY = y-range;
    var hY = y+range;
    if( lY < 0 ) lY = 0;
    if( hY >= mH ) hY = mH-1;
    for( ; lY<=hY; lY++ ){
      
      var disY = Math.abs( lY-y );
      lX = x-range+disY;
      hX = x+range-disY;
      if( lX < 0 ) lX = 0;
      if( hX >= mW ) hX = mW-1;
      for( ; lX<=hX; lX++ ){
        
        model.fogData[lX][lY] += value;
      }
    }
  };
  
  /**
   * @param {Number} x x coordinate on the map
   * @param {Number} y y coordinate on the map
   * @param {Number} range
   * @param {Number} value value that will be added to the position
   */
  model.modifyVisionAt = modifyVisionAt;
  
  /**
   * 
   * 
   * @param {Number} pid id number of the target player
   */
  model.recalculateFogMap = function( pid ){ 
    var x;
    var y;
    var xe = model.mapWidth;
    var ye = model.mapHeight;
    var tid = model.players[pid].team;
    var fogEnabled = (controller.configValue("fogEnabled") === 1);
    
    /*
    if( weather === undefined ) weather = model.weather.ID;

    var visionMod = model.sheets.weatherSheets[weather].visionChange;
    if( visionMod === undefined ){
      visionMod = 0;
    }
    */
    
    // RESET FOG MAP
    for( x=0 ;x<xe; x++ ){
      for( y=0 ;y<ye; y++ ){
        if( !fogEnabled ){
          model.fogData[x][y] = 1;
        }
        else{
          model.fogData[x][y] = 0;
        }
      }
    }
    
    // ADD VISIONERS
    if( fogEnabled ){
      for( x=0 ;x<xe; x++ ){
        for( y=0 ;y<ye; y++ ){
          
          var unit = model.unitPosMap[x][y];
          if( unit !== null ){
            var sid = unit.owner;
            if( pid === sid || model.players[sid].team === tid ){
              var vision = unit.type.vision;
              if( vision < 0 ) vision = 0;
              
              modifyVisionAt( x,y, sid, vision,1 );
            }
          }
          
          var property = model.propertyPosMap[x][y];
          if( property !== null ){
            var sid = property.owner;
            if( sid !== -1 && ( pid === sid || model.players[sid].team === tid ) ){
              var vision = property.type.vision;
              if( vision < 0 ) vision = 0;
              
              modifyVisionAt( x,y, sid, vision,1 );
            }
          }
        }
      }
    }
  };
  
});