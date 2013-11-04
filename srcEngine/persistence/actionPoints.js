controller.persistence_defineHandler(
  
  // load
  function( dom ){

    // reset data to false (*no one can act*)
    for( var i=0, e=model.actions_leftActors.length; i<e; i++ ){
      model.actions_leftActors[i] = false;
    }

    // check data
    if( !util.isUndefined(dom.actr)){
      assert( Array.isArray(dom.actr) );

      var i = dom.actr.length;
      while( i-- ){
        assert( util.intRange(dom.actr[i],0,MAX_UNITS_PER_PLAYER) );

        model.actions_leftActors[dom.actr[i]] = true;
      }
    }
  },
  
  // save
  function( dom ){ // TODO: make better with growing array
    var arr = [];
    for( var i=0,e=model.actions_leftActors.length; i<e; i++ ){
      
      // add slot index to the document model if the slot can act
      if( model.actions_leftActors[i] ) arr.push( i );
    }
    
    dom.actr = arr;
  }
);