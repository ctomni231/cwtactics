model.event_on("prepare_game",function( dom ){
  var property,data;
  
  // reset all 
  for( var i = 0, e = model.property_data.length; i < e; i++ ){
    model.property_data[i].owner = INACTIVE_ID;
    model.property_data[i].type  = null;
  }
  
  for( var i = 0, e = dom.prps.length; i < e; i++ ) {
    data = dom.prps[i];
    
    assert( util.intRange(data[0],0,MAX_PROPERTIES-1) );  // id
    assert( util.intRange(data[1],0,MAX_MAP_WIDTH-1) );   // x
    assert( util.intRange(data[2],0,MAX_MAP_HEIGHT-1) );  // y
    assert( 
      ( util.isString(data[3]) && 
       !util.isUndefined( model.data_tileSheets[data[3]].capturePoints) ) ||
      typeof model.data_tileSheets[data[3]].cannon !== "undefined" ||
      typeof model.data_tileSheets[data[3]].laser !== "undefined" ||
      typeof model.data_tileSheets[data[3]].rocketsilo !== "undefined"
    );
    assert( (util.intRange(data[4],1,                     // capture points
                           model.data_tileSheets[data[3]].capturePoints)) ||
           (util.intRange(data[4],-99,-1)) ||
           typeof model.data_tileSheets[data[3]].rocketsilo !== "undefined"
          );
    assert( util.intRange(data[5],-1,MAX_PLAYER-1) );     // owner
    
    // copy data into model
    property                                    = model.property_data[ data[0] ];
    property.type                               = model.data_tileSheets[data[3]];
    property.capturePoints                      = 20;
    property.owner                              = data[5];
    property.x                                  = data[1];
    property.y                                  = data[2];
    model.property_posMap[ data[1] ][ data[2] ] = property;
  }
});

model.event_on("load_game",function( dom ){
  var property;
  for( var i = 0, e = dom.prps.length; i < e; i++ ) {
    var data = dom.prps[i];
    
    property               = model.property_data[ data[0] ];
    property.capturePoints = data[4];
  }
});

model.event_on("save_game",function( dom ){
  var prop;
  
  dom.prps = [ ];
  for( var i = 0, e = model.property_data.length; i < e; i++ ) {
    prop = model.property_data[i];
    
    // persist it if the owner of the property is not INACTIVE
    if( prop.owner !== INACTIVE_ID ) {
      dom.prps.push( [
        i,
        prop.x,
        prop.y,
        prop.type.ID,
        prop.capturePoints,
        prop.owner
      ] );
    }
  }
});