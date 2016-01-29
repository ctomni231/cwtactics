model.event_on("parse_co",function( sheet ){

  // stars
  assertIntRange( sheet.coStars,-1,10 );
  assertIntRange( sheet.scoStars,-1,10);
  assert( sheet.coStars !== 0 );
  assert( sheet.scoStars !== 0 );

  // rules
  assertList( sheet.d2d );
  assertList( sheet.cop.turn );
  assertList( sheet.scop.turn );
  assert( sheet.cop.power );
  assert( sheet.scop.power );

  assertStr( sheet.faction );
  assertStr( sheet.music );
});
