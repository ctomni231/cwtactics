// Resets the game time meta data at start of the game round.
//
model.event_on("gameround_start",function(){
  model.timer_turnTimeElapsed = 0;
  model.timer_gameTimeElapsed = 0;
  model.timer_turnTimeLimit   = controller.configValue("model.timer_turnTimeLimit")*60000;
  model.timer_gameTimeLimit   = controller.configValue("model.timer_gameTimeLimit")*60000;
});

// Resets the turn timer at turn start.
//
model.event_on("nextTurn_pidStartsTurn",function( pid ){
  model.timer_turnTimeElapsed = 0;
});

// Updates the turn meta data
//
model.event_on("gameround_update",function( delta ){
  model.timer_turnTimeElapsed += delta;
  model.timer_gameTimeElapsed += delta;

  // check turn time
  if( model.timer_turnTimeLimit > 0 &&
      model.timer_turnTimeElapsed >= model.timer_turnTimeLimit ){
    controller.commandStack_sharedInvokement("nextTurn_invoked");
  }

  // check game time
  if( model.timer_gameTimeLimit > 0 &&
      model.timer_gameTimeElapsed >= model.timer_gameTimeLimit ){
    controller.update_endGameRound();
  }
});
