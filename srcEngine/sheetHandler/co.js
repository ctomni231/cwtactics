model.data_coParser.addHandler( function( sheet ){

  // stars
  assert( util.intRange(sheet.coStars,-1,10) && sheet.coStars !== 0 );
  assert( util.intRange(sheet.scoStars,-1,10) && sheet.scoStars !== 0 );

  // rules
  assert( Array.isArray(sheet.d2d) );
  assert( Array.isArray(sheet.cop.turn) );
  assert( Array.isArray(sheet.scop.turn) );
  assert( sheet.cop.power );
  assert( sheet.scop.power );

  assert( util.isString(sheet.faction) );
  assert( util.isString(sheet.music) );
});