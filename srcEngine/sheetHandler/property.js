model.event_on("parse_tile",function( sheet ){
  if( sheet.points !== void 0 ){
    assertIntRange( sheet.points,1,100 );
  }
  if( sheet.funds !== void 0 ){
    assertIntRange( sheet.funds,1,99999 );
  }
});

model.event_on("parse_unit",function( sheet ){
  if( sheet.captures !== void 0 ){
    assertIntRange( sheet.captures,1,10 );
  }
});
