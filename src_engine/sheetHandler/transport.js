model.event_on("parse_unit",function( sheet ){
  if( sheet.canload ){
    assertIntRange( sheet.maxloads,1,5 );
    assertList( sheet.canload );

    for( var i=0,e=sheet.canload.length; i<e; i++ ){
      assertStr( sheet.canload[i] );
    }
  }
});
