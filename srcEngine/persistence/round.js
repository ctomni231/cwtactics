// Define persitence handler
controller.persistence_defineHandler(
  
  // load
  function( dom ){

    model.round_turnOwner = 0;
    model.round_day       = 0;

    // check turn owner from save
    if( !util.isUndefined(dom.trOw) ){
      assert( util.intRange(dom.trOw,0,999999) );
      model.round_turnOwner = dom.trOw;
    }

    // check day from save
    if( !util.isUndefined(dom.day) ){
      assert( util.intRange(dom.day,0,999999) );
      model.round_day = dom.day;
    }
  },
  
  // save
  function( dom ){ 
    
    dom.trOw = model.round_turnOwner;
    dom.day  = model.round_day;
  }
);