model.data_unitParser.addHandler(function(sheet){

  assert( model.data_movetypeSheets.hasOwnProperty(sheet.movetype) );

  assert( util.intRange( sheet.range, 0, MAX_SELECTION_RANGE ) );
  assert( util.intRange( sheet.fuel, 0, 99 ) );
  
  assert( (typeof sheet.stealth === "undefined" || typeof sheet.stealth === "boolean") );
});