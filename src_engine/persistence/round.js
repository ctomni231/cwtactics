model.event_on("prepare_game",function( dom ){
  model.round_turnOwner = -1;
  model.round_day       = 0;
});

model.event_on("load_game",function( dom ){
  assert( util.intRange(dom.trOw,0,999999) );
  assert( util.intRange(dom.day,0,999999) );
  
  model.round_turnOwner = dom.trOw;
  model.round_day       = dom.day;
});

model.event_on("save_game",function( dom ){
  dom.trOw = model.round_turnOwner;
  dom.day  = model.round_day;
});