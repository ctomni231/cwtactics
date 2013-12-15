model.event_on("load_game",function( dom ){
  assert( util.isInt(dom.gmTm) && dom.gmTm >= 0 );
  assert( util.isInt(dom.tnTm) && dom.tnTm >= 0 );

  model.timer_gameTimeElapsed = dom.gmTm;
  model.timer_turnTimeElapsed = dom.tnTm;
});

model.event_on("save_game",function( dom ){
  dom.gmTm = model.timer_gameTimeElapsed;
  dom.tnTm = model.timer_turnTimeElapsed;
});
