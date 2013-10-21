// ### Controller.nGameRound
// Is `true` when a game round is active else `false`
//
controller.inGameRound = false;

// ### Controller.evaledChars_
// Holds the number of evaluated characters so far. (only active in `DEBUG` mode)
//
if( DEBUG ) controller.evaledChars_ = 0;

// ### Controller.updateState
// Updates the current state of the game engine.
//
controller.updateState = function( delta ){
  if( DEBUG && !controller.inGameRound ) model.errorCorruptDataModel("update state","no game round is active");
  
  // update the internal timer
  model.updateTimer( delta );
  
  // the timer can end the game round if the round ends then leave update step
  if( !controller.inGameRound ) return;
  
  // when no commands left in the buffer then leave
  if( controller.actionBuffer_.isEmpty()) return;
  
  // grab next action and search correct shared function context
  var data = controller.actionBuffer_.pop();
  var actionId = controller.actionMap[data[data.length - 1]];
  
  if( DEBUG ){
    if( !actionId ) model.errorCorruptDataModel("update state","unknown action id => "+actionId);

    var command = JSON.stringify(data);
    controller.evaledChars_ += command.length;

    // NOTE logs actual evaluated characters by incoming commands, this isn't needed for the game, but gives the possible answers for the design of the save games
    util.log( "evaluate action data", command, "\n * action key :", actionId, "\n * evaluated characters (acc.) :", controller.evaledChars_ );
  }
  
  // invoke the action function with the given action data
  model[ actionId ].apply(model, data);
};

// ### Controller.prepareGameRound
// Does some preparations for the active game round
//
controller.prepareGameRound = function( ){
  if( DEBUG ) controller.evaledChars_ = 0;

  controller.actionBuffer_.clear();
};

// ### Controller.startGameRound
// Starts a new game round.
//
controller.startGameRound = function( ){
  if( DEBUG && !controller.inGameRound ) model.errorLogicFault("start game round","game round is already active");
  
  // initializer controllers
  controller.inGameRound = true;

  // start first turn
  model.turnOwner--;
  controller.localInvokement( "nextTurn", []);
};

// ### Controller.endGameRound
// Ends the active game round.
//
controller.endGameRound = function(){
  if( DEBUG && !controller.inGameRound ) model.errorLogicFault("end game round","no game round is active");
  
  controller.inGameRound = false;
};
