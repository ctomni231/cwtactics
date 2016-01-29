model.event_on("parse_movetype",function( sheet ){
  var keys,key, i,value;

  assert( sheet.costs );
  keys  = Object.keys( sheet.costs );
  i     = keys.length;
  while( i-- ){

    key = keys[i];
    assertStr( key );
    assert( key === "*" || model.data_tileSheets.hasOwnProperty(key) );

    value = sheet.costs[key];
    assertIntRange( value,-1,MAX_SELECTION_RANGE );
    assert( value !== 0 );
  }
});
