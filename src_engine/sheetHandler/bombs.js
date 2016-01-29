model.event_on("parse_tile",function( sheet ){
  if( sheet.suicide !== void 0 ){
    assertIntRange( sheet.suicide.damage,1,9 );
    assertIntRange( sheet.suicide.range ,1,MAX_SELECTION_RANGE );

    if( sheet.suicide.noDamage ){

      var i = sheet.suicide.nodamage.length;
      while( i-- ){
        assertStr( sheet.suicide.nodamage[i] );
      }
    }
  }
});
