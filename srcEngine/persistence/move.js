model.moveTypeParser.addHandler( function( sheet ){
  var keys,key, i,value;

  assert( Array.isArray( sheet.costs ) );
  keys  = Object.keys( sheet.costs );
  i     = keys.length;
  while( i-- ){

    key = keys[i];
    assert( util.isString(key) );
    assert( key === "*" || model.tileTypes.hasOwnProperty(key) );

    value = sheet.costs[key];
    assert( util.intRange(value,-1,MAX_SELECTION_RANGE) );
    assert( value !== 0 );
  }
});