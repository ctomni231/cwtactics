// Changes the vision value at a given field by a given range.
//
model.event_on("modifyVisionAt", function( x,y, pid, range, value ){
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

        if( model.map_data[lX][lY].blocksVision && 
            model.map_getDistance(x,y,lX,lY) > 1  ) continue;

        if( clientVisible )    model.fog_clientData[lX][lY]     += value;
        if( turnOwnerVisible ) model.fog_turnOwnerData[lX][lY]  += value;
      }
    }
  }
});

// Recalculates the fog map for the client and the turn owner.
//
model.event_on("recalculateFogMap", function(){
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
    var vision;
    for( x=0 ;x<xe; x++ ){
      for( y=0 ;y<ye; y++ ){

        var unit = model.unit_posData[x][y];
        if( unit !== null ){
          vision = unit.type.vision;
          if( vision < 0 ) vision = 0;

          model.events.modifyVisionAt( x,y, unit.owner, vision,1 );
        }

        var property = model.property_posMap[x][y];
        if( property !== null ){
          vision = property.type.vision;
          if( vision < 0 ) vision = 0;

          model.events.modifyVisionAt( x,y, property.owner, vision,1 );
        }
      }
    }
  }
});


// Updates the visible player id meta data for the client as well for the turn owner.
//
model.event_on("nextTurn_pidStartsTurn", function(pid){
  var toTid = model.player_data[pid].team;

  // update last pid
  if( model.client_instances[pid] ) model.client_lastPid = pid;

  var clTid = model.client_lastPid;

  // the active client can see what his and all allied objects can see
  for( var i=0,e=MAX_PLAYER; i<e; i++ ){
    model.fog_visibleClientPids[i]    = false;
    model.fog_visibleTurnOwnerPids[i] = false;

    if( model.player_data[i].team === INACTIVE_ID ) continue;

    if( model.player_data[i].team === clTid ) model.fog_visibleClientPids[i] = true;
    if( model.player_data[i].team === toTid ) model.fog_visibleTurnOwnerPids[i] = true;
  }

  model.events.recalculateFogMap();
});
