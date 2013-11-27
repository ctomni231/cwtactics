// commands
controller.action_registerCommands("fog_recalculateFogMap");
controller.action_registerCommands("fog_modifyVisionAt");

// events
controller.event_define("fog_modifyVisionAt");
controller.event_define("fog_recalculateFogMap");

// scriptables
controller.defineGameScriptable("vision",1,40);

// configs
controller.defineGameConfig("fogEnabled",0,1,1);

// Contains the fog data map. A value 0 means a tile is not visible. A value greater than 0 means 
// it is visible for n units ( n = fog value of the tile ).
//
model.fog_turnOwnerData = util.matrix( MAX_MAP_WIDTH, MAX_MAP_HEIGHT, 0 );

// Same as `model.fog_turnOwnerData` but this map is the fog data for the player id that is 
// visible on the local client.
//
model.fog_clientData = util.matrix( MAX_MAP_WIDTH, MAX_MAP_HEIGHT, 0 );

// This fog list contains the visible id's of all player instances that are visible for 
// the active client instance.
//
model.fog_visibleClientPids = util.list( MAX_PLAYER, false );

// This fog list contains the visible id's of all player instances that are visible for the 
// current turn owner.
//
model.fog_visibleTurnOwnerPids = util.list( MAX_PLAYER, false );

// Will be invoked when a player registers one player as local client player. Throws an error 
// if an other player tries to connect a player instance that is already a local player instance.
//
model.fog_remoteConnectOfPlayer = function( pid ){
  assert( model.player_isValidPid(pid) );
  
  // FIXME
};

// Updates the visible player id meta data for the client as well for the turn owner.
//
model.fog_updateVisiblePid = function(){
  var tid   = model.player_data[model.client_lastPid].team;
  var totid = model.player_data[model.round_turnOwner].team;

  // the active client can see what his and all allied objects can see
  for( var i=0,e=MAX_PLAYER; i<e; i++ ){

    model.fog_visibleClientPids[i]    = (model.client_instances[i] === true || 
                                       model.player_data[i].team === tid );
    
    model.fog_visibleTurnOwnerPids[i] = (i === model.round_turnOwner || 
                                totid === model.player_data[i].team);
  }
};

// Changes the vision value at a given field by a given range.
//
model.fog_modifyVisionAt = function( x,y, pid, range, value ){
  if( pid === INACTIVE_ID ) return; // ignore neutral objects

  if( !controller.configValue("fogEnabled") ) return;
  
  assert( model.map_isValidPosition(x,y) );
  // assert( model.player_isValidPid(pid) );
  assert( util.isInt(range) && range >= 0 );
  
  controller.prepareTags( x, y );
  
  // only real visioners ( units and radar properties ) can alter the vision value via rules
  if( range > 0 ) range = controller.scriptedValue( pid,"vision", range );
  
  var clientVisible     = model.fog_visibleClientPids[pid];
  var turnOwnerVisible  = model.fog_visibleTurnOwnerPids[pid];

  // no active player owns this visioner
  if( !clientVisible && !turnOwnerVisible ) return; 

  if( range === 0 ){

    if( clientVisible )    model.fog_clientData[x][y]     += value;
    if( turnOwnerVisible ) model.fog_turnOwnerData[x][y]  += value;
  }
  else{

    var mH = model.map_height;
    var mW = model.map_width;
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
        
        // if( DEBUG ) util.log( "(",lX,",",lY,") changed fog by (",value,")" );

        if( clientVisible )    model.fog_clientData[lX][lY]     += value;
        if( turnOwnerVisible ) model.fog_turnOwnerData[lX][lY]  += value;
      }
    }
  }
  
  
  // Invoke event
  controller.events.fog_modifyVisionAt( x,y, pid, range, value );
};

// Recalculates the fog map for the client and the turn owner.
//
model.fog_recalculateFogMap = function(){ 
  var x;
  var y;
  var xe = model.map_width;
  var ye = model.map_height;
  var fogEnabled = (controller.configValue("fogEnabled") === 1);
    
  // 1. reset fog maps 
  for( x=0 ;x<xe; x++ ){
    for( y=0 ;y<ye; y++ ){
      
      if( !fogEnabled ){
        model.fog_clientData[x][y]    = 1;
        model.fog_turnOwnerData[x][y] = 1;
      }
      else{
        model.fog_clientData[x][y]    = 0;
        model.fog_turnOwnerData[x][y] = 0;
      }
      
    }
  }
  
  // 2. add vision objects
  if( fogEnabled ){
    for( x=0 ;x<xe; x++ ){
      for( y=0 ;y<ye; y++ ){
        
        var unit = model.unit_posData[x][y];
        if( unit !== null ){
          var vision = unit.type.vision;
          if( vision < 0 ) vision = 0;
            
          model.fog_modifyVisionAt( x,y, unit.owner, vision,1 );
        }
        
        var property = model.property_posMap[x][y];
        if( property !== null ){
          var vision = property.type.vision;
          if( vision < 0 ) vision = 0;
            
          model.fog_modifyVisionAt( x,y, property.owner, vision,1 );
        }
      }
    }
  }
  
  // Invoke event
  controller.events.fog_recalculateFogMap();
};