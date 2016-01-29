model.event_on("prepare_game",function( dom ){
  controller.buildRoundConfig( null );
});

model.event_on("load_game",function( dom ){
  // check values
  var keys = Object.keys(dom.cfg);
  var i    = keys.length;
  while( i-- ){
    assert( util.isInt(dom.cfg[keys[i]]) );
  }
  
  // load save game config
  controller.buildRoundConfig( dom.cfg );
});

model.event_on("save_game",function( dom ){
  dom.cfg = model.cfg_configuration;
});