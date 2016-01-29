model.event_on("prepare_game",function( dom ){
  model.dayTick_dataTime.resetValues();
  model.dayTick_dataEvent.resetValues();
  model.dayTick_dataArgs.resetValues();
});

model.event_on("load_game",function( dom ){
  var i    = 0;
  var e    = dom.dyev.length;

  assert( dom.dyea.length === e*2 );

  for(; i<e; i++ ){

    // check it
    assertInt( dom.dyev[i] );
    assertStr( dom.dyee[i] );
    assert( dom.dyev[i] > 0 );

    // load it
    model.dayTick_dataTime[i]     = dom.dyev[i];
    model.dayTick_dataEvent[i]    = dom.dyee[i];
    model.dayTick_dataArgs[2*i]   = dom.dyea[2*i];
    model.dayTick_dataArgs[2*i+1] = dom.dyea[2*i+1];
  }
});

model.event_on("save_game",function( dom ){
  dom.dyet = [];
  dom.dyee = [];
  dom.dyea = [];

  var i = 0;
  var e = model.dayTick_dataTime.length;
  for( ;i<e; i++ ){

    if( list[i] !== INACTIVE_ID ){
      dom.dyet.push(list[i]);
      dom.dyee.push(model.dayTick_dataEvent[i]);
      dom.dyea.push(model.dayTick_dataArgs[2*i],model.dayTick_dataArgs[2*i+1]);
    }
  }
});
