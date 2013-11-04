controller.persistence_defineHandler(
  
  // load
  function( dom ){
    var cfg = null;

    if( !util.isUndefined(dom.cfg) ){

      // check values
      var keys = Object.keys(dom.cfg);
      var i    = keys.length;
      while( i-- ){
        assert( util.isInt(dom.cfg[keys[i]]) );
      }

      cfg = dom.cfg;
    }

    // load configuration
    controller.buildRoundConfig( cfg );
  },
  
  // save
  function( dom ){
    dom.cfg = model.cfg_configuration;
  }
  
);