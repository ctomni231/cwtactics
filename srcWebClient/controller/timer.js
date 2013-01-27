controller._turnTimerTime = 0;

controller.resetTurnTimer = function(){
  controller._turnTimerTime = 0;
};

controller.updateTurnTimer = function( delta ){
  if(controller._turnTimerTime >= 0 && model.rules.turnTimeLimit > 0 ){
    controller._turnTimerTime += delta;
    if( controller._turnTimerTime > model.rules.turnTimeLimit ){

      controller._turnTimerTime = -1;
      return true;
    }
  }
  return false;
};