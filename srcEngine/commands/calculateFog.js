controller.engineAction({

  name:"calculateFog",
  
  key:"CCFO",
  
  /**
   * Calculates the fog map for a given player id.
   *
   * @param {Number} pid player id
   *
   * @methodOf controller.actions
   * @name calculateFog
   */
  action: function( pid, weather ){
    var x;
    var y;
    var xe = model.mapWidth;
    var ye = model.mapHeight;
    var tid = model.players[pid].team;
    var fogEnabled = model.rules.fogEnabled;
    
    if( weather === undefined ) weather = model.weather.ID;
    
    var visionMod = model.sheets.weatherSheets[weather].visionChange;
    if( visionMod === undefined ){
      visionMod = 0;
    }
    
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
    
    if( fogEnabled ){
      for( x=0 ;x<xe; x++ ){
        for( y=0 ;y<ye; y++ ){
    
            //--------
            var unit = model.unitPosMap[x][y];
            if( unit !== null ){
              var sid = unit.owner;
              if( pid === sid || model.players[sid].team === tid ){
                var vision = model.sheets.unitSheets[unit.type].vision + visionMod;
                if( vision < 0 ) vision = 0;
                
                controller.actions.addVision( x,y, vision );
              }
            }
      
            //--------
            var property = model.propertyPosMap[x][y];
            if( property !== null ){
              var sid = property.owner;
              if( pid === sid || model.players[sid].team === tid ){
                var vision = model.sheets.tileSheets[property.type].vision + visionMod;
                if( vision < 0 ) vision = 0;
                
                controller.actions.addVision( x,y, vision );
              }
            }
        }
      }
    }
  }
  
});