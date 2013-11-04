controller.persistence_defineHandler(
  
  // load
  function( dom ){ 
    model.manpower_data.resetValues();

    if( !util.isUndefined(dom.mpw) ){
      assert( Array.isArray(dom.mpw) );

      // manpower must be >= 0
      var i = dom.mpw.length;
      while( i-- ){
        assert( util.isInt(dom.mpw) && dom.mpw >= 0 );
      }

      // load it into the model
      model.manpower_data.grabValues( dom.mpw );
    }
  },
  
  // save
  function( dom ){
    dom.mpw = model.manpower_data.cloneValues([]);
  }
);
