controller.persistence_defineHandler(
  
  
  // -----------------------------------------------------------------------
  // load map data
  //

  function(){
    model.timer_resetTurnTimer();
  },

  // -----------------------------------------------------------------------
  // load save game data
  //

  function(dom){
    assert( util.isInt(dom.gmTm) && dom.gmTm >= 0 );
    assert( util.isInt(dom.tnTm) && dom.tnTm >= 0 );

    model.timer_gameTimeElapsed = dom.gmTm;
    model.timer_turnTimeElapsed = dom.tnTm;
  },
  
  // -----------------------------------------------------------------------
  // save game data
  //
  
  function(dom){
    dom.gmTm = model.timer_gameTimeElapsed;
    dom.tnTm = model.timer_turnTimeElapsed;
  }
);