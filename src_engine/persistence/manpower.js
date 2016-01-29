model.event_on("prepare_game",function( dom ){
  model.manpower_data.resetValues();
});

model.event_on("load_game",function( dom ){
  assert( Array.isArray(dom.manpower) );
  
  // manpower must be >= 0
  var i = dom.manpower.length-1;
  do{
    assert( util.isInt(dom.manpower[i]) && dom.manpower[i] >= 0 );
    i--;
  }
  while( i>=0 );
  
  // load it into the model
  model.manpower_data.grabValues( dom.manpower );
});

model.event_on("save_game",function( dom ){
  dom.mpw = model.manpower_data.cloneValues([]);
});