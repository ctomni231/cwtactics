model.event_on("parse_unit",function( sheet ){
  assertIntRange( sheet.cost,0,999999 );
});

model.event_on("parse_tile",function( sheet ){
  if( sheet.builds ){
    assertList( sheet.builds );

    var i = sheet.builds.length;
    while( i-- ){
      assertStr( sheet.builds[i] );
    }
  }
});
