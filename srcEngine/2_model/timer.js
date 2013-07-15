controller.defineGameConfig("turnTimeLimit",0,60,0);
controller.defineGameConfig("gameTimeLimit",0,99999,0);

util.scoped(function(){
  
  // CONFIG
  var turnTimeLimit = 0;
  var gameTimeLimit = 0;
  
  /** @type Number */
  model.gametimeElapsed = 0;
  
  /** @type Number */
  model.turntimeElapsed = 0;
  
  // Define persistence handler
  controller.persistenceHandler(
  
  	// load
  	function(dom){
  		model.setupTimer();
  		
  		// set timer by dom when parameters are defined
  		if( util.expectNumber( dom, "gmTm", true, true ) ) model.gametimeElapsed = dom.gmTm;
  		if( util.expectNumber( dom, "tnTm", true, true ) ) model.turntimeElapsed = dom.tnTm;
  	},
  	
  	// save
  	function(dom){
  		dom.gmTm = model.gametimeElapsed;
  		dom.tnTm = model.turntimeElapsed;
  	}
  );
  
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
