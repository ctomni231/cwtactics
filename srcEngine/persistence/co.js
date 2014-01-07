model.event_on("prepare_game",function( dom ){
  var target, i, e;
  
  // reset data
  i = 0;
  e = MAX_PLAYER;
  for( ;i<e;i++ ){
    target            = model.co_data[i];
    target.power      = 0;
    target.timesUsed  = 0;
    target.level      = model.co_POWER_LEVEL.INACTIVE;
    target.coA        = null;
    target.coB        = null;
  }
});

model.event_on("load_game",function( dom ){
  var source, target, i, e;
  
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
});

model.event_on("save_game",function( dom ){
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
});