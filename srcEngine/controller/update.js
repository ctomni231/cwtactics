// Is `true` when a game round is active
// else `false`
controller.inGameRound = false;

// Holds the number of evaluated characters
// so far
controller.evaledChars_ = 0;

// Updates the current state of the game engine.
//
// @param {Number} delta time since last update step
//
controller.updateState = function( delta ){
  if( !controller.inGameRound ) util.raiseError("no game round is active");
  
  // update the internal timer
  model.updateTimer( delta );
  
  // the timer can end the game round
  // if the round ends then leave update step
  if( !controller.inGameRound ) return;
  
  // when no commands left in the 
  // buffer then leave
  if( controller.actionBuffer_.isEmpty()) return;
  
  // grab next action and search correct shared 
  // function context
  var data = controller.actionBuffer_.pop();
  var actionId = controller.actionMap[data[data.length - 1]];
  
  if( !actionId ){
    model.criticalError( 
      constants.error.ILLEGAL_DATA, 
      constants.error.ILLEGAL_ACTION_FUNCTION_ID 
    );
  }
   
  if( constants.DEBUG ){
    var command = JSON.stringify(data);
    controller.evaledChars_ += command.length;
    
    util.log(
      "evaluate action data", command,
      "\n * action key :",actionId,
      "\n * evaluated characters (acc.) :", controller.evaledChars_ 
    );
  }
  
  // invoke the action function with 
  // the given action data
  model[ actionId ].apply(model, data);
};

controller.prepareGameRound = function( ){
  controller.evaledChars_ = 0;
  controller.actionBuffer_.clear();
};

// Starts a new game round.
//
controller.startGameRound = function( ){
  if( controller.inGameRound ){
    model.criticalError( 
      constants.error.ILLEGAL_DATA, 
      constants.error.GAME_ROUND_ACTIVE 
    );
  }
  
  // initializer controllers
  controller.inGameRound = true;

  // start first turn
  model.turnOwner--;
  controller.localInvokement( "nextTurn", []);
};

// Ends the active game round.
//
controller.endGameRound = function(){
  if( !controller.inGameRound ){
    model.criticalError( 
      constants.error.ILLEGAL_DATA, 
      constants.error.NO_GAME_ROUND_ACTIVE 
    );
  }
  
  controller.inGameRound = false;
};