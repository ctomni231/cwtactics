model.event_on("parse_unit",function( sheet ){
  assert( model.data_movetypeSheets.hasOwnProperty(sheet.movetype) );
  assertIntRange( sheet.range, 0, MAX_SELECTION_RANGE );
  assertIntRange( sheet.fuel, 0, 99 );
  if( sheet.stealth !== void 0 ) assertBool(sheet.stealth);
});
