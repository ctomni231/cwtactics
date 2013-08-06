// Fog Module
//

// ### Meta Data

controller.registerInvokableCommand("recalculateFogMap");
controller.registerInvokableCommand("modifyVisionAt");

controller.defineEvent("modifyVisionAt");
controller.defineEvent("recalculateFogMap");

controller.defineGameScriptable("vision",1,40);

controller.defineGameConfig("fogEnabled",0,1);

model.unitTypeParser.addHandler(function(sheet){
    if( !util.expectNumber(sheet,"vision",true,true,1,constants.MAX_SELECTION_RANGE) ) return false;
});

model.tileTypeParser.addHandler(function(sheet){
    if( !util.expectNumber(sheet,"vision",false,true,0,constants.MAX_SELECTION_RANGE) ) return false;
});

// ---
// ### Model

// Contains the fog data map. A value 0 means a tile is not visible. 
// A value greater than 0 means it is visible for n units ( n = fog value of the tile ).
model.fogData = util.matrix( constants.MAX_MAP_WIDTH, constants.MAX_MAP_HEIGHT, 0 );

// Same as `model.fogData` but this map is the fog data for
// the player id that is visible on the local client.
model.clientFogData = util.matrix( constants.MAX_MAP_WIDTH, constants.MAX_MAP_HEIGHT, 0 );

// Contains all player instances that will be controlled
// by the local client including AI instances
model.clientInstances = util.list( constants.MAX_PLAYER, false );

// Define persistence handler for 
// recognize game initializing event
controller.persistenceHandler(
  
  // load
  function(){
    model.clientInstances.resetValues();
    model.recalculateFogMap(0);
  },
  
  // save
  function(){}
)

// ---
// ### Logic

// Registers a player id as local player
//
model.registerClientPlayer = function( pid ){
  if( !model.isValidPlayerId(pid) ) return false;
  
  model.clientInstances[pid] = true;
  return true;
};

// Will be invoked when a player registers one player
// as local client player. Throws an error if an other
// player tries to connect a player instance that
// is already a local player instance.
//
model.remoteConnectOfPlayer = function( pid ){
  if( !model.isValidPlayerId(pid) ){
    model.criticalError( 
      constants.error.ILLEGAL_PARAMETERS,
      constants.error.UNKNOWN_PLAYER_ID
    );
  }
  
  // if player is already registered locally 
  // then it's a game state break
  if( model.clientInstances[pid] ){
    model.criticalError( 
      constants.error.ILLEGAL_PARAMETERS,
      constants.error.GAME_STATE_BREAK
    );
  }
};

// @param {Number} x x coordinate on the map
// @param {Number} y y coordinate on the map
// @param {Number} range
// @param {Number} value value that will be added to the position 
model.modifyVisionAt = function( x,y, pid, range, value ){
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
      
      if( model.clientInstances[pid] ) model.clientFogData[lX][lY] += value;
      model.fogData[lX][lY] += value;
    }
  }
  
  // Invoke event
  controller.events.modifyVisionAt( x,y, pid, range, value );
};

// @param {Number} pid id number of the target player
model.recalculateFogMap = function( pid ){ 
  var x;
  var y;
  var xe = model.mapWidth;
  var ye = model.mapHeight;
  var tid = model.players[pid].team;
  var fogEnabled = (controller.configValue("fogEnabled") === 1);
    
  // RESET FOG MAP
  for( x=0 ;x<xe; x++ ){
    for( y=0 ;y<ye; y++ ){
      
      if( !fogEnabled ){
        if( model.clientInstances[pid] ) model.clientFogData[x][y] = 1;
        model.fogData[x][y] = 1;
      }
      else{
        if( model.clientInstances[pid] ) model.clientFogData[x][y] = 0;
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
            
            model.modifyVisionAt( x,y, sid, vision,1 );
          }
        }
        
        var property = model.propertyPosMap[x][y];
        if( property !== null ){
          var sid = property.owner;
          if( sid !== -1 && ( pid === sid || model.players[sid].team === tid ) ){
            var vision = property.type.vision;
            if( vision < 0 ) vision = 0;
            
            model.modifyVisionAt( x,y, sid, vision,1 );
          }
        }
      }
    }
  }
  
  // Invoke event
  controller.events.recalculateFogMap( pid );
};