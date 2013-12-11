// Define persistence handler
controller.persistence_defineHandler(
  
  
  // -----------------------------------------------------------------------
  // load map data
  //

  function(){
    model.round_turnOwner = -1;
    model.round_day       = 0;
  },

  // -----------------------------------------------------------------------
  // load save game data
  //

  function( dom ){
    assert( util.intRange(dom.trOw,0,999999) );
    assert( util.intRange(dom.day,0,999999) );

    model.round_turnOwner = dom.trOw;
    model.round_day       = dom.day;
  },
  
  // -----------------------------------------------------------------------
  // save game data
  //
  
  function( dom ){ 
    
    dom.trOw = model.round_turnOwner;
    dom.day  = model.round_day;
  }
);