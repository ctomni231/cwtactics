controller.persistence_defineHandler(
  
  // load
  function(dom){
    model.timer_resetTurnTimer();

    assert( util.isInt(dom.gmTm) && dom.gmTm >= 0 );
    assert( util.isInt(dom.tnTm) && dom.tnTm >= 0 );

    model.timer_setupTimer();
  },
  
  // save
  function(dom){
    dom.gmTm = model.timer_gameTimeElapsed;
    dom.tnTm = model.timer_turnTimeElapsed;
  }
);