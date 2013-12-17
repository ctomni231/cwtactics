//
 //
model.event_on( "loadUnit_check",function(  loid, tuid ){
  if( !model.transport_isTransportUnit( tuid ) ||
      !model.transport_canLoadUnit( loid, tuid ) ){
    return false;
  }
});

// Returns true if a transporter unit can unload one of it's loads at a given position.
// This functions understands the given pos as possible position for the transporter.
//
model.event_on( "unloadUnit_check",function(  uid, x,y ){
  var loader = model.unit_data[uid];
  var pid    = loader.owner;
  var unit;

  // only transporters with loads can unload things
  // TODO: is transport could be an assertion
  if( !( model.transport_isTransportUnit( uid ) &&
          model.transport_hasLoads( uid ) ) ){
    return false;
  }

  var i = model.unit_firstUnitId( pid );
  var e = model.unit_lastUnitId(  pid );
  for( ; i<=e; i++ ){

    unit = model.unit_data[i];
    if( unit.owner !== INACTIVE_ID && unit.loadedIn === uid ){
      var movetp = model.data_movetypeSheets[ unit.type.movetype ];

      if( model.move_canTypeMoveTo(movetp,x-1,y) ) return;
      if( model.move_canTypeMoveTo(movetp,x+1,y) ) return;
      if( model.move_canTypeMoveTo(movetp,x,y-1) ) return;
      if( model.move_canTypeMoveTo(movetp,x,y+1) ) return;
    }
  }

  return false;
});

// Loads the unit with id lid into a tranporter with the id tid.
//
model.event_on( "loadUnit_invoked", function( loid, tuid ){
  assert(model.transport_canLoadUnit( loid, tuid ),
         "transporter unit",tuid,"cannot load unit",loid);

  model.unit_data[ loid ].loadedIn = tuid;
  model.unit_data[ tuid ].loadedIn--;
});

// Adds unload targets for a transporter at a given position to the menu.
//
model.event_on( "unloadUnit_addUnloadTargetsToMenu", function( uid, x,y, menu ){
  var loader = model.unit_data[uid];
  var pid    = loader.owner;
  var i      = model.unit_firstUnitId( pid );
  var e      = model.unit_lastUnitId( pid );
  var unit;

  for( ;i<=e; i++ ){
    unit = model.unit_data[i];

    if( unit.owner !== INACTIVE_ID && unit.loadedIn === uid ){
      var movetp = model.data_movetypeSheets[ unit.type.movetype ];

      if( model.move_canTypeMoveTo(movetp,x-1,y) ||
          model.move_canTypeMoveTo(movetp,x+1,y) ||
          model.move_canTypeMoveTo(movetp,x,y-1) ||
          model.move_canTypeMoveTo(movetp,x,y+1) ) menu.addEntry( i, true );
    }
  }
});

// Adds unload targets for a transporter at a given position to the selection.
//
model.event_on( "unloadUnit_addUnloadTargetsToSelection", function( uid, x,y, loadId, selection ){
  var loader = model.unit_data[uid];
  var movetp = model.data_movetypeSheets[ model.unit_data[ loadId ].type.movetype ];

  if( model.move_canTypeMoveTo(movetp,x-1,y) ) selection.setValueAt( x-1,y, 1 );
  if( model.move_canTypeMoveTo(movetp,x+1,y) ) selection.setValueAt( x+1,y, 1 );
  if( model.move_canTypeMoveTo(movetp,x,y-1) ) selection.setValueAt( x,y-1, 1 );
  if( model.move_canTypeMoveTo(movetp,x,y+1) ) selection.setValueAt( x,y+1, 1 );
});

// Unloads the unit with id lid from a tranporter with the id tid.
//
model.event_on( "unloadUnit_invoked", function( transportId, trsx, trsy, loadId, tx,ty  ){

  // loadId must be loaded into transportId
  assert( model.unit_data[ loadId ].loadedIn === transportId );

  // TODO: remove this later
  // trapped ?
  if( tx === -1 || ty === -1 || model.unit_posData[tx][ty] ){
    controller.stateMachine.data.breakMultiStep = true;
    return;
  }

  // remove transport link
  model.unit_data[ loadId      ].loadedIn = -1;
  model.unit_data[ transportId ].loadedIn++;

  // extract mode code id
  var moveCode;
       if( tx < trsx ) moveCode = model.move_MOVE_CODES.LEFT;
  else if( tx > trsx ) moveCode = model.move_MOVE_CODES.RIGHT;
  else if( ty < trsy ) moveCode = model.move_MOVE_CODES.UP;
  else if( ty > trsy ) moveCode = model.move_MOVE_CODES.DOWN;

  // move load out of the transporter
  controller.commandStack_localInvokement("move_clearWayCache");
  controller.commandStack_localInvokement("move_appendToWayCache",moveCode);
  controller.commandStack_localInvokement("move_moveByCache",loadId,trsx,trsy,1);
  controller.commandStack_localInvokement("wait_invoked",loadId);
});
