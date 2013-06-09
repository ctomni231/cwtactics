util.scoped(function(){
  
  // CONFIG
  var turnTimeLimit = 0;
  var gameTimeLimit = 0;
  
  /** @type Number */
  model.gametimeElapsed = 0;
  
  /** @type Number */
  model.turntimeElapsed = 0;
  
  /**
   * Resets the game round timer.
   */
  model.resetTurnTimer = function(){ 
    model.turntimeElapsed = 0;
  };

  /**
   * @param {Number} delta
   */
  model.updateTimer = function( delta ){
    model.turntimeElapsed += delta;
    model.gametimeElapsed += delta;
    
    // FORCE END TURN ?
    if( turnTimeLimit && model.turntimeElapsed >= turnTimeLimit ){
      model.nextTurn.callAsCommand();
    }
    
    // END GAME ?
    if( gameTimeLimit && model.gametimeElapsed >= gameTimeLimit ){
      controller.endGameRound();
    }
  };
  
  /**
   * 
   */
  model.setupTimer = function(){
    model.turntimeElapsed = 0;
    model.gametimeElapsed = 0;
    
    // CONVERT TO MILLISECONDS AND CACHE THEM
    turnTimeLimit = controller.configValue("turnTimeLimit")*60000;
    gameTimeLimit = controller.configValue("gameTimeLimit")*60000;
    
  };
});

