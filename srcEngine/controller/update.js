// Is `true` when a game round is active else `false`
//
controller.update_inGameRound = false;

// Holds the number of evaluated characters so far. (only active in `DEBUG` mode)
//
if( DEBUG ) controller.update_evaledChars_ = 0;

// Updates the current state of the game engine.
//
controller.update_tickFrame = function( delta ){
  assert( controller.update_inGameRound );

  // update the internal timer
  model.timer_updateTimer( delta );
  
  // the timer can end the game round if the round ends then leave update step
  if( !controller.update_inGameRound ) return;
  
  // when no commands left in the buffer then leave
  if( controller.action_buffer_.isEmpty()) return;
  
  // grab next action and search correct shared function context
  var data      = controller.action_buffer_.pop();
  var actionId  = controller.action_map[data[data.length - 1]];

  assert( actionId );

  if( DEBUG ){
    var command                     = JSON.stringify(data);
    controller.update_evaledChars_ += command.length;

    // NOTE logs actual evaluated characters by incoming commands, this isn't needed for the
    // game, but gives the possible answers for the design of the save games
    util.log(
      "evaluate action data",
      command,
      "\n * action key :",
      actionId,
      "\n * evaluated characters (acc.) :",
      controller.update_evaledChars_
    );
  }
  
  // invoke the action function with the given action data
  model[ actionId ].apply(model, data);
};

// Does some preparations for the active game round
//
controller.update_prepareGameRound = function( ){
  if( DEBUG ) controller.update_evaledChars_ = 0;

  controller.action_buffer_.clear();
};

// Starts a new game round.
//
controller.update_startGameRound = function( ){
  assert( !controller.update_inGameRound );
  
  // initializer controllers
  controller.update_inGameRound = true;

  // start first turn
  if( model.round_turnOwner === -1 ){
    controller.action_localInvoke( "round_nextTurn", []);
    if( controller.isHost() ) model.weather_calculateNext();
  }
};

// Ends the active game round.
//
controller.update_endGameRound = function(){
  assert( controller.update_inGameRound );
  
  controller.update_inGameRound = false;
};
