// commands
controller.action_registerCommands("round_nextTurn");

// events
controller.event_define("round_nextTurn");

// config
controller.defineGameConfig("round_dayLimit",0,999,0);

// Represents the current action day in the game. The day attribute increases
// everytime if the first player starts its turn.
// 
model.round_day = 0;

// Holds the identical number of the current turn owner.
// 
model.round_turnOwner = -1;

// Returns true if the given player id is the current turn owner.
//
model.round_isTurnOwner = function( pid ){
  return model.round_turnOwner === pid;
};

// Converts a number of days into turns.
//
// @param {Number} v number in days 
model.round_daysToTurns = function( v ){
  return model.player_data.length*v;
};

// Ends the turn for the current active turn owner.
// Invokes the `round_nextTurn` event.
model.round_nextTurn = function(){
  var pid = model.round_turnOwner;
  var oid = pid;
  var i,e;
  
  // Try to find next player from the player pool
  pid++;
  while( pid !== oid ){
    
    if( pid === MAX_PLAYER ){
      pid = 0;
      
      // Next day 
      model.round_day++;
      model.dayEvents_tick();
      
      var round_dayLimit = controller.configValue("round_dayLimit");
      if( round_dayLimit > 0 && model.round_day === round_dayLimit ){
        controller.update_endGameRound();
      }
    }
    
    // Found next player
    if( model.player_data[pid].team !== INACTIVE_ID ) break;
    
    pid++;
  }
  
  // If the new player id is the same as the old 
  // player id then the game data is corrupted
  assert( pid !== oid );
  
  // do turn start stuff for all **properties**
  for( i=0,e=model.property_data.length; i<e; i++ ){
    if( model.property_data[i].owner !== pid ) continue;
    
    model.supply_giveFunds( i );
    model.supply_propertyRepairs( i );
    model.supply_propertySupply( i );
  }
  
  var turnStartSupply = ( controller.configValue("autoSupplyAtTurnStart") === 1 );
  
  // do turn start stuff for all **units**
  i= model.unit_firstUnitId( pid ); 
  e= model.unit_lastUnitId( pid );
  for( ; i<e; i++ ){
    if( model.unit_data[i].owner === INACTIVE_ID ) continue;
    
    model.unit_drainFuel( i );
    if(turnStartSupply) model.supply_tryUnitSuppliesNeighbours( i );
  }

  // starts the turn
  model.round_startTurn(pid);
};

// Starts a turn for player with id (`pid`).
//
model.round_startsTurn = function( pid ){

  model.actions_prepareActors(pid);
  model.timer_resetTurnTimer();

  // Sets the new turn owner
  model.round_turnOwner = pid;
  if( model.client_isLocalPid(pid) ) model.client_lastPid = pid;

  model.fog_updateVisiblePid();
  model.fog_recalculateFogMap(); // needs to be done after setting new clientPid

  controller.events.round_nextTurn();

  // start AI logic if new turn owner is AI controlled this local instance is the host
  if( controller.isHost() && !controller.ai_isHuman(pid) ){
    controller.ai_machine.event("tick");
  }
};