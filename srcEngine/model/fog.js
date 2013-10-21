// # Fog Module
//

// ### Meta Data

controller.registerInvokableCommand("recalculateFogMap");
controller.registerInvokableCommand("modifyVisionAt");

controller.defineEvent("modifyVisionAt");
controller.defineEvent("recalculateFogMap");

controller.defineGameScriptable("vision",1,40);

controller.defineGameConfig("fogEnabled",0,1,1);

model.unitTypeParser.addHandler(function(sheet){
    if( !util.expectNumber(sheet,"vision",true,true,1,MAX_SELECTION_RANGE) ) return false;
});

model.tileTypeParser.addHandler(function(sheet){
    if( !util.expectNumber(sheet,"vision",false,true,0,MAX_SELECTION_RANGE) ) return false;
});

// ---
// ### Model

// Contains the fog data map. A value 0 means a tile is not visible. 
// A value greater than 0 means it is visible for n units ( n = fog value of the tile ).
model.fogData = util.matrix( MAX_MAP_WIDTH, MAX_MAP_HEIGHT, 0 );

// Same as `model.fogData` but this map is the fog data for
// the player id that is visible on the local client.
model.clientFogData = util.matrix( MAX_MAP_WIDTH, MAX_MAP_HEIGHT, 0 );

model.clientFogVisible = util.matrix( MAX_PLAYER, false );
model.turnOwnerFogVisible = util.matrix( MAX_PLAYER, false );

// Define persistence handler for 
// recognize game initializing event
controller.persistenceHandler(
  
  // load
  function(){},
  
  // save
  function(){}
)

// ---
// ### Logic

// Will be invoked when a player registers one player
// as local client player. Throws an error if an other
// player tries to connect a player instance that
// is already a local player instance.
//
model.remoteConnectOfPlayer = function( pid ){
  if( !model.isValidPlayerId(pid) ){
    model.criticalError( 
      error.ILLEGAL_PARAMETERS,
      error.UNKNOWN_PLAYER_ID
    );
  }
  
  // if player is already registered locally 
  // then it's a game state break
  if( model.clientInstances[pid] ){
    model.criticalError( 
      error.ILLEGAL_PARAMETERS,
      error.GAME_STATE_BREAK
    );
  }
};

model.updateVisiblePid = function(){
  var tid = model.players[model.lastActiveClientPid].team;
  var totid = model.players[model.turnOwner].team;
  for( var i=0,e=MAX_PLAYER; i<e; i++ ){

    // the active client can see what his and all allied objects can see
    model.clientFogVisible[i] = (model.clientInstances[i] === true || tid === model.players[i].team);
    model.turnOwnerFogVisible[i] = (i === model.turnOwner || totid === model.players[i].team);
  }
};

// @param {Number} x x coordinate on the map
// @param {Number} y y coordinate on the map
// @param {Number} range
// @param {Number} value value that will be added to the position 
model.modifyVisionAt = function( x,y, pid, range, value ){
  if( !controller.configValue("fogEnabled") ) return;
  
  controller.prepareTags( x, y );
  
  // only real visioners ( units and radar properties ) can
  // alter the vision value via rules
  if( range > 0 ){
    range = controller.scriptedValue( pid,"vision", range );
  }
  
  var clientVisible = model.clientFogVisible[pid];
  var turnOwnerVisible = model.turnOwnerFogVisible[pid];

  // no active player owns this visioner
  if( !clientVisible && !turnOwnerVisible ) return; 

  if( range === 0 ){

    if( clientVisible )    model.clientFogData[x][y] += value;
    if( turnOwnerVisible ) model.fogData[x][y]       += value;
  }
  else{

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
        
        util.log( "("+lX+","+lY+") changed fog by ("+value+")" );

        if( clientVisible )    model.clientFogData[lX][lY] += value;
        if( turnOwnerVisible ) model.fogData[lX][lY]       += value;
      }
    }
  }
  
  
  // Invoke event
  controller.events.modifyVisionAt( x,y, pid, range, value );
};

// @param {Number} pid id number of the target player
model.recalculateFogMap = function(){ 
  var x;
  var y;
  var xe = model.mapWidth;
  var ye = model.mapHeight;
  var fogEnabled = (controller.configValue("fogEnabled") === 1);
    
  // 1. reset fog maps 
  for( x=0 ;x<xe; x++ ){
    for( y=0 ;y<ye; y++ ){
      
      if( !fogEnabled ){
        model.clientFogData[x][y] = 1;
        model.fogData[x][y]       = 1;
      }
      else{
        model.clientFogData[x][y] = 0;
        model.fogData[x][y]       = 0;
      }
      
    }
  }
  
  // 2. add vision objects
  if( fogEnabled ){
    for( x=0 ;x<xe; x++ ){
      for( y=0 ;y<ye; y++ ){
        
        var unit = model.unitPosMap[x][y];
        if( unit !== null ){
          var vision = unit.type.vision;
          if( vision < 0 ) vision = 0;
            
          model.modifyVisionAt( x,y, unit.owner, vision,1 );
        }
        
        var property = model.propertyPosMap[x][y];
        if( property !== null ){
          var vision = property.type.vision;
          if( vision < 0 ) vision = 0;
            
          model.modifyVisionAt( x,y, property.owner, vision,1 );
        }
      }
    }
  }
  
  // Invoke event
  controller.events.recalculateFogMap();
};
