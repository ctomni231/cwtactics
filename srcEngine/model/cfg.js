// Define persistence handler
controller.persistenceHandler(
  
  // load
  function( dom ){
    controller.buildRoundConfig( dom.cfg );
  },
  
  // save
  function( dom ){
    dom.cfg = model.configRule;
  }
  
);

model.configRule = null;