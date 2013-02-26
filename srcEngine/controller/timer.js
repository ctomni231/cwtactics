/**
 * @private
 */
controller._turnTimerTime = 0;

/**
 * Resets the turn timer.
 */
controller.resetTurnTimer = function(){
  controller._turnTimerTime = 0;
};

/**
 * Updates the turn timer.
 * 
 * @param {Number} delta time since last call
 */
controller.updateTurnTimer = function( delta ){
  if(controller._turnTimerTime >= 0 && model.rules.turnTimeLimit > 0 ){
    controller._turnTimerTime += delta;
    if( controller._turnTimerTime > model.rules.turnTimeLimit ){

      controller._turnTimerTime = -1;
      controller.pushSharedAction("NXTR");
    }
  }
};