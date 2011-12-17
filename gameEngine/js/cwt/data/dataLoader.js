define(["cwt/database","sys/logger","mod/"+MOD+"/config"],
	function(db,logger,_modConf){
		
	for( i in _modConf ){
		logger.info("mod config {'"+i+"', '"+_modConf[i]+"'}");
	}
	
	function sheetHandler( data ){
		if( data._iCode !== '_unitSheet' )
			throw new Error("not an unit type sheet holder");
		
		var _unit;
		for( i in data.sheets ){
			_unit = data.sheets[i];
			logger.info("got unit type ("+_unit.ID+")");
			db.unitSheet( _unit );
		}
	}
	
	for( i in _modConf.objectFiles ){
		logger.info("load file "+_modConf.objectFiles[i]);
		require(["json!mod/"+MOD+"/"+_modConf.objectFiles[i]],sheetHandler);
	}
	
	
	
	
	
	//TODO implement loading algorithm
	
	// first tiles
	// then weathers
	// then move types
	// then armor types
	// then weapons
	// then units
});