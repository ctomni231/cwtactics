// invokable commands
controller.action_registerCommands("actions_markUnitActable");
controller.action_registerCommands("actions_markUnitNonActable");
controller.action_registerCommands("actions_trapWait");
controller.action_registerCommands("actions_setStatus");

// events
model.event_define("actions_markUnitNonActable");
model.event_define("actions_markUnitActable");
model.event_define("actions_trapWait");

// Holds the identical numbers of all objects that can act during the turn. After a unit has acted, 
// it should be removed from this list with `model.actions_markUnitNonActable`.
// 
model.actions_leftActors = util.list( MAX_UNITS_PER_PLAYER, false );

// Returns true if the selected uid can act in the current active turn, else false.
//
model.actions_canAct = function( uid ){
  assert( model.unit_isValidUnitId(uid) );
  
  var startIndex = model.round_turnOwner * MAX_UNITS_PER_PLAYER;
  if( uid >= startIndex + MAX_UNITS_PER_PLAYER || uid < startIndex ){
    return false;
  }
  else return model.actions_leftActors[ uid - startIndex ] === true;
};

// Sets the actable status of a given unit id. Only units of the current active turn owner can 
// change their status.
//
model.actions_setStatus = function( uid, canAct ){
  if( DEBUG ) util.log("set actable state of uid:",uid," to ",canAct);
  
  assert( model.unit_isValidUnitId(uid) );
  assert( util.isBoolean(canAct) );
  
  model.actions_leftActors[ uid - (model.round_turnOwner * MAX_UNITS_PER_PLAYER)] = canAct;
};

// Marks an unit as not-actable.
// 
model.actions_markUnitNonActable = function( uid ){
  model.actions_setStatus( uid, false );
  model.events.actions_markUnitNonActable( uid );
};

// Marks an unit as actable.
// 
model.actions_markUnitActable = function( uid ){
  model.actions_setStatus( uid, true );
  model.events.actions_markUnitActable( uid );
};

// Called when an unit is trapped. Invokes the `actions_trapWait` event.
//  
model.actions_trapWait = function( uid ){
  if( DEBUG ) util.log("unit id:",uid," got trapped");
  
  model.actions_setStatus( uid, false );
  model.events.actions_trapWait( uid );
};

// Resets the actable status of all objects of the current turn owner.
//
model.actions_prepareActors = function( pid ){
  if( DEBUG ) util.log("prepare actable stats for player id:",pid);
  
  assert( model.player_isValidPid(pid) );
    
  var i   = model.unit_firstUnitId( pid ); 
  var e   = model.unit_lastUnitId(  pid );
  var io  = i;
  
  for( ; i<e; i++ ){
    
    // every object slot which is allocated, will be actable
    model.actions_leftActors[ i-io ] = ( model.unit_data[i].owner !== INACTIVE_ID );
  }
};