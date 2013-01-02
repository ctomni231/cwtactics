controller.registerCommand({

  key: "endGame",

  // -----------------------------------------------------------------------
  condition: util.FUNCTION_FALSE_RETURNER,

  // -----------------------------------------------------------------------
  action: function( data ){
    if( DEBUG ){
      util.logInfo("the game ends because no opposite players exists");
    }
  }

});