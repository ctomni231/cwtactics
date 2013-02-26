controller.engineAction({

  name: "endGame",

  key: "EDGM",

  /**
   * Ends the game round.
   *
   * @methodOf controller.actions
   * @name endGame
   */
  action: function(){

    if( DEBUG ){
      util.log("the game ends because no opposite players exists");
    }
  }

});