controller.engineAction({

  name: "saveGame",

  key: "SAGA",

  /**
   * Saves the game round.
   *
   * @methodOf controller.actions
   * @name saveGame
   */
  action: function(){
    if( DEBUG ){
      util.log("start saving game instance");
    }

    var handler = controller.getActiveSerializationHandler();
    var json = handler.save();
    json = JSON.stringify( json, null, "\t" ); // SERIALIZE IT

    // data.setSubAction( json );

    if( DEBUG ){
      util.log("game instance successfully saved");
    }
  }
});