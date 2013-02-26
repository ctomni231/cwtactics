controller.engineAction({

  name: "loadGame",

  key: "LDGM",

  /**
   * Loads a game file into the domain model.
   *
   * @param map map container
   *
   * @methodOf controller.actions
   * @name loadGame
   */
  action: function( map ){

    if( DEBUG ){
      util.log("start loading game instance");
    }

    // LOAD MAP
    var handler = controller.getActiveSerializationHandler( map.format );
    handler.load( map );

    // LOAD RULES
    model.setRulesByOption({});
    
    controller.actions.calculateFog( model.turnOwner );

    if( DEBUG ){
      util.log("game instance successfully loaded");
    }
  }
});