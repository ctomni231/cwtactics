// configs
controller.defineGameConfig("model.timer_turnTimeLimit",0,60,0);
controller.defineGameConfig("model.timer_gameTimeLimit",0,99999,0);

// Maximum turn time limit in ms.
//
model.timer_turnTimeLimit = 0;

// Maximum game time limit in ms.
//
model.timer_gameTimeLimit = 0;

// Current elapsed game time in ms.
//
model.timer_gameTimeElapsed = 0;

// Current elapsed turn time in ms.
//
model.timer_turnTimeElapsed = 0;

// Resets the turn time limit timer.
//
model.timer_resetTurnTimer = function(){ 
  model.timer_turnTimeElapsed = 0;
};

// Updates the timers.
//
model.timer_updateTimer = function( delta ){
  assert( util.isInt(delta) && delta >= 0 );

  model.timer_turnTimeElapsed += delta;
  model.timer_gameTimeElapsed += delta;
  
  // check turn time
  if( model.timer_turnTimeLimit > 0 && model.timer_turnTimeElapsed >= model.timer_turnTimeLimit ){
    controller.action_localInvoke("round_nextTurn",[]);
  }

  // check game time
  if( model.timer_gameTimeLimit > 0 && model.timer_gameTimeElapsed >= model.timer_gameTimeLimit ){
    controller.update_endGameRound();
  }
};

// Setups the timers.
//
model.timer_setupTimer = function(){
  model.timer_turnTimeElapsed = 0;
  model.timer_gameTimeElapsed = 0;
  model.timer_turnTimeLimit = controller.configValue("model.timer_turnTimeLimit")*60000;
  model.timer_gameTimeLimit = controller.configValue("model.timer_gameTimeLimit")*60000;
};