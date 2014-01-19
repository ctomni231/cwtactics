// Is `true` when a game round is active else `false`
//
controller.update_inGameRound = false;

// Updates the current state of the game engine.
//
controller.update_tickFrame = function( delta ){
  assert( controller.update_inGameRound );

  model.events.gameround_update(delta);

  if( !controller.commandStack_hasData() ){
    if( controller.ai_active ) controller.ai_machine.event("tick");
  }
  else controller.commandStack_invokeNext();
};

// Does some preparations for the active game round
//
controller.update_prepareGameRound = function( ){
  controller.commandStack_resetData();
};

// Starts a new game round.
//
controller.update_startGameRound = function( ){
  assert( !controller.update_inGameRound );

  // initializer controllers
  controller.update_inGameRound = true;

  // start first turn
  if( model.round_turnOwner === -1 ){
    model.events.gameround_start();
    controller.commandStack_localInvokement( "nextTurn_invoked" );
    if( controller.network_isHost() ) model.events.weather_calculateNext();
  }
};

// Ends the active game round.
//
controller.update_endGameRound = function(){
  assert( controller.update_inGameRound );

  controller.update_inGameRound = false;
};
