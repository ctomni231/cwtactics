// some specs
model.property_specCaptures = util.expect.intRange(1,10);
model.property_specPoints = util.expect.intRange(1,100);
model.property_specFunds = util.expect.intRange(10,99999);

model.unitTypeParser.addHandler( function( sheet ){
  if( !util.isUndefined(sheet.captures) ){
    assert( util.intRange(sheet.captures,1,10) );
  }
});

model.tileTypeParser.addHandler( function( sheet ){
  if( !util.isUndefined(sheet.points) ){ assert( util.intRange(sheet.points,1,100)  ); }
  if( !util.isUndefined(sheet.funds) ){  assert( util.intRange(sheet.funds,1,99999) ); }
});

controller.persistence_defineHandler(
  // load
  function( dom ){
    var property;

    // reset all properties in the model
    for( var i = 0, e = model.property_data.length; i < e; i++ ){
      model.property_data[i].owner = INACTIVE_ID;
    }
    
    // set properties from a save
    for( var i = 0, e = dom.prps.length; i < e; i++ ) {
      var data = dom.prps[i];
      
      // check data
      assert( util.intRange(data[0],0,MAX_PROPERTIES-1) );
      assert( util.intRange(data[1],0,MAX_MAP_WIDTH-1) );
      assert( util.intRange(data[2],0,MAX_MAP_HEIGHT-1) );
      assert( util.intRange(data[4],0,MAX_MAP_HEIGHT-1) );
      assert( util.isString(data[3]) && !util.isUndefined(model.tileTypes[data[3]].capturePoints));
      assert( util.intRange(data[5],1,model.tileTypes[data[3]].capturePoints) );

      // copy data into model
      property                                    = model.property_data[ data[0] ];
      property.type                               = model.tileTypes[data[3]];
      property.capturePoints                      = data[4];
      property.owner                              = data[5];
      property.x                                  = data[1];
      property.y                                  = data[2];
      model.property_posMap[ data[1] ][ data[2] ] = property;
    }
  },

  // save
  function( dom ){
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
  }
);