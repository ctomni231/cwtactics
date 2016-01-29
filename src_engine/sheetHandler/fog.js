model.event_on("parse_unit",function( sheet ){
  assertIntRange( sheet.vision,1,MAX_SELECTION_RANGE );
});

model.event_on("parse_tile",function( sheet ){
  if( sheet.vision !== void 0 ){
    assertIntRange( sheet.vision,0,MAX_SELECTION_RANGE );
  }
});
