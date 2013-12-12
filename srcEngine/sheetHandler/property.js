model.data_unitParser.addHandler( function( sheet ){
  if( !util.isUndefined(sheet.captures) ){
    assert( util.intRange(sheet.captures,1,10) );
  }
});

model.data_tileParser.addHandler( function( sheet ){
  if( !util.isUndefined(sheet.points) ){ assert( util.intRange(sheet.points,1,100)  ); }
  if( !util.isUndefined(sheet.funds) ){  assert( util.intRange(sheet.funds,1,99999) ); }
});