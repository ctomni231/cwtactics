model.event_on("prepare_game",function( dom ){
  for( var i=0, e=model.actions_leftActors.length; i<e; i++ ){
    model.actions_leftActors[i] = false;
  }
});

model.event_on("load_game",function( dom ){
  assert( Array.isArray(dom.actr) );
  
  var i = dom.actr.length;
  while( i-- ){
    assert( util.intRange(dom.actr[i],0,MAX_UNITS_PER_PLAYER) );
    model.actions_leftActors[dom.actr[i]] = true;
  }
});

model.event_on("save_game",function( dom ){
  var arr = [];
  for( var i=0,e=model.actions_leftActors.length; i<e; i++ ){
    
    // add slot index to the document model if the slot can act
    if( model.actions_leftActors[i] ) arr.push( i );
  }
  
  dom.actr = arr;
});