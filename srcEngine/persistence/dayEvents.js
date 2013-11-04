controller.persistence_defineHandler(
  
  // load
  function(dom){
    var list = model.dayEvents_data;

    // reset data
    for( i=0, e=list.length; i<e; i++ ){
      list[i][0] = null;
      list[i][1] = null;
      list[i][2] = null;
    }

    // load data from save
    if( !util.isUndefined(dom.dyev) ){
      var i = 0;
      var e = dom.dyev.length;
      for(; i<e; i++ ){

        // check it
        assert( util.isInt(list[i][0]) && list[i][0] >= 0 );
        assert( util.isString(list[i][1]) );
        assert( Array.isArray(list[i][2]) );

        // load it
        list[i][0] = dom.dyev[i][0];
        list[i][1] = dom.dyev[i][1];
        list[i][2] = dom.dyev[i][2];
      }
    }
  },
  
  // save
  function(dom){
    dom.dyev = [];

    var i = 0;
    var e = model.dayEvents_data.length;
    for( ;i<e; i++ ){

      // entry exists when timer is given
      if( model.dayEvents_data[i] !== null ){
        dom.dyev.push( model.dayEvents_data[i] );
      }
    }
  }
);