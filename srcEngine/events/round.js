// Ends the turn for the current active turn owner.
//
model.event_on("nextTurn_invoked",function(){
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

  // starts the turn
  model.events.nextTurn_pidStartsTurn(pid);
});

// Starts a turn for player with id (`pid`).
//
model.event_on("nextTurn_pidStartsTurn",function(pid){

  // Sets the new turn owner
  model.round_turnOwner = pid;
  if( model.client_isLocalPid(pid) ) model.client_lastPid = pid;

  // do turn start stuff for all **properties**
  for( i=0,e=model.property_data.length; i<e; i++ ){
    if( model.property_data[i].owner !== pid ) continue;
    model.events.nextTurn_propertyCheck(i);
  }

  var turnStartSupply = ( controller.configValue("autoSupplyAtTurnStart") === 1 );

  // do turn start stuff for all **units**
  i= model.unit_firstUnitId( pid );
  e= model.unit_lastUnitId( pid );
  for( ; i<e; i++ ){

    if( model.unit_data[i].owner === INACTIVE_ID ) continue;
    model.events.nextTurn_unitCheck(i);
  }

  // start AI logic if new turn owner is AI controlled this local instance is the host
  if( controller.network_isHost() && !controller.ai_isHuman(pid) ){
    controller.ai_machine.event("tick");
  }
});
