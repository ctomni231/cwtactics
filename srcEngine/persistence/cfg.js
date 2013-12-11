controller.persistence_defineHandler(
  
  // -----------------------------------------------------------------------
  // load map data
  //

  function(){
    controller.buildRoundConfig( null );
  },

  // -----------------------------------------------------------------------
  // load save game data
  //

  function( dom ){
    // check values
    var keys = Object.keys(dom.cfg);
    var i    = keys.length;
    while( i-- ){
      assert( util.isInt(dom.cfg[keys[i]]) );
    }

    // load save game config
    controller.buildRoundConfig( dom.cfg );
  },
  
  // -----------------------------------------------------------------------
  // save game data
  //

  function( dom ){
    dom.cfg = model.cfg_configuration;
  }
  
);