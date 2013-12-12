model.data_unitParser.addHandler( function( sheet ){
  assert( util.intRange(sheet.cost,0,999999) );
});

model.data_tileParser.addHandler( function( sheet ){
  if( !util.isUndefined(sheet.builds) ){
    assert( Array.isArray(sheet.builds) );

    var i = sheet.builds.length;
    while( i-- ){
      assert( util.isString(sheet.builds[i]) );
    }
  }
});