model.data_coParser.addHandler( function( sheet ){

  // stars
  assert( util.intRange(sheet.coStars,-1,10) && sheet.coStars !== 0 );
  assert( util.intRange(sheet.scoStars,-1,10) && sheet.scoStars !== 0 );

  // rules
  assert( Array.isArray(sheet.d2d) );
  assert( Array.isArray(sheet.cop) );
  assert( Array.isArray(sheet.scop) );

  assert( util.isString(sheet.faction) );
  assert( util.isString(sheet.music) );
});

controller.persistence_defineHandler(

  // load
  function( dom ){
    var source, target, i, e;

    // reset data
    i = 0;
    e = MAX_PLAYER;
    for( ;i<e;i++ ){
      target            = model.co_data[i];
      target.power      = 0;
      target.timesUsed  = 0;
      target.level      = INACTIVE_POWER;
      target.coA        = null;
      target.coB        = null;
    }

    // load data from save
    if( !util.isUndefined(dom.co)){
      assert( Array.isArray(dom.co) && dom.co.length === MAX_PLAYER );

      i = 0;
      e = MAX_PLAYER;
      for( ;i<e;i++ ){
        source = dom.co[i];
        if( source > 0 ){

          // check data
          assert( util.intRange(source[0],0,999999) );
          assert( util.intRange(source[1],0,999999) );
          assert( util.intRange(source[2],model.co_MODES.NONE,model.co_MODES.AWDR) );
          assert( util.isString(source[3]) && model.data_coSheets.hasOwnProperty(source[3]) );
          assert( util.isString(source[4]) && model.data_coSheets.hasOwnProperty(source[4]) );

          // load data
          target            = model.co_data[i];
          target.power      = source[0];
          target.timesUsed  = source[1];
          target.level      = source[2];
          target.coA        = (source[3])? model.data_coSheets[ source[3] ] : null;
          target.coB        = (source[4])? model.data_coSheets[ source[4] ] : null;
        }
      }
    }
  },
  
  // save
  function( dom ){
    
    // result document model for co data will be a matrix
    var data = [ ];
    var obj;
    
    for( var i = 0, e = MAX_PLAYER; i < e; i++ ) {
      obj = model.co_data[i];
      
      // persist the data as array if target player isn't active then use a `0` as data
      if( model.player_data[i].team === INACTIVE_ID ) {
        data.push( 0 );
      } else {
        data.push( [
          obj.power,
          obj.timesUsed,
          obj.level,
          obj.coA,
          obj.coB
        ] );
      }
    }
    
    dom.co = data;
  }
);