model.unitTypeParser.addHandler(function(sheet){

  if( !util.isUndefined(sheet.suicide) ){
    assert( util.intRange(sheet.suicide.damage,1,9) );
    assert( util.intRange(sheet.suicide.range ,1,MAX_SELECTION_RANGE) );

    if( !util.isUndefined(sheet.suicide.noDamage) ){

      var i = sheet.suicide.nodamage.length;
      while( i-- ){

        assert( util.isStringsheet.suicide.nodamage[i] );
      }
    }
  }
});