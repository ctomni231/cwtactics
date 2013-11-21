model.data_unitParser.addHandler(function(sheet){

	if( typeof sheet.canload !== "undefined" ){
    //assert( util.isBoolean(sheet.suppliesloads) );
		assert( util.intRange( sheet.maxloads,1,5) );

    assert( Array.isArray( sheet.canload) );
    for( var i=0,e=sheet.canload.length; i<e; i++ ){
      assert( util.isString(sheet.canload[i]) )
    }
	}
});