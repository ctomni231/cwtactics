controller.persistence_defineHandler(
  
  // -----------------------------------------------------------------------
  // load map data
  //

  function(){
    for( var i=0, e=model.actions_leftActors.length; i<e; i++ ){
      model.actions_leftActors[i] = false;
    }
  },

  // -----------------------------------------------------------------------
  // load save game data
  //

  function( dom ){
    assert( Array.isArray(dom.actr) );

    var i = dom.actr.length;
    while( i-- ){
      assert( util.intRange(dom.actr[i],0,MAX_UNITS_PER_PLAYER) );
      model.actions_leftActors[dom.actr[i]] = true;
    }
  },
  
  // -----------------------------------------------------------------------
  // save game data
  //

  function( dom ){ // TODO: make better with growing array
    var arr = [];
    for( var i=0,e=model.actions_leftActors.length; i<e; i++ ){
      
      // add slot index to the document model if the slot can act
      if( model.actions_leftActors[i] ) arr.push( i );
    }
    
    dom.actr = arr;
  }
);