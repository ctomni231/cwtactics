// commands
controller.action_registerCommands("transport_loadInto");
controller.action_registerCommands("transport_unloadFrom");

// events
controller.event_define("transport_loadInto");
controller.event_define("transport_unloadFrom");

// Has a transporter unit with id tid loaded units? Returns true if yes, else false.
//
model.transport_hasLoads = function( tid ){
  assert( model.unit_isValidUnitId(tid) );
  
	var pid = model.unit_data[tid].owner;
	for( var i=model.unit_firstUnitId(pid),e=model.unit_lastUnitId(pid); i<e; i++ ){
		if( i !== tid ){
			var unit = model.unit_data[ i ];
			if( unit !== null && unit.loadedIn === tid ) return true;
		}
	}
	
	return false;
};

// Returns true if the unit with the id lid is loaded by a transporter unit with id tid.
//
model.transport_isLoadedBy = function( lid, tid ){
  assert( model.unit_isValidUnitId(lid) );
  assert( model.unit_isValidUnitId(tid) );
  assert( lid !== tid );
  
	return model.unit_data[ lid ].loadedIn === tid;
};

// Loads the unit with id lid into a tranporter with the id tid.
//
model.transport_loadInto = function( loadId, transportId ){
  assert( model.unit_isValidUnitId(loadId) );
  assert( model.unit_isValidUnitId(transportId) );
  
	if( !model.transport_canLoadUnit( loadId, transportId ) ){
		assert(false,"transporter unit",transportId,"cannot load unit",loadId);
	}
	
	model.unit_data[ loadId ].loadedIn = transportId;
	model.unit_data[ transportId ].loadedIn--;
	
	controller.events.transport_loadInto( loadId, transportId );
};

// Unloads the unit with id lid from a tranporter with the id tid.
//
model.transport_unloadFrom = function( transportId, trsx, trsy, loadId, tx,ty ){
  assert( model.unit_isValidUnitId(loadId) );
  assert( model.unit_isValidUnitId(transportId) );
  assert( model.map_isValidPosition(tx,ty) );
  assert( model.map_isValidPosition(trsx,trsy) );

  // loadId must be loaded into transportId
  assert( model.unit_data[ loadId ].loadedIn === transportId );
		
	// TODO: remove this later
	// trapped ?
	if( tx === -1 || ty === -1 ) return;
	
	// remove transport link
	model.unit_data[ loadId 			].loadedIn = -1;
	model.unit_data[ transportId 	].loadedIn++;
	
	// extract mode code id
	var moveCode;
	if( tx < trsx ) moveCode = model.move_MOVE_CODES.LEFT;
	else if( tx > trsx ) moveCode = model.move_MOVE_CODES.RIGHT;
	else if( ty < trsy ) moveCode = model.move_MOVE_CODES.UP;
	else if( ty > trsy ) moveCode = model.move_MOVE_CODES.DOWN;
			
	controller.events.transport_unloadFrom( transportId, trsx, trsy, loadId, tx,ty );
	
	// move load out of the transporter
	model.move_moveUnitByPath([moveCode], loadId, trsx, trsy);
	model.actions_markUnitNonActable( loadId );
};

// Returns true if a transporter unit can unload one of it's loads at a given position. 
// This functions understands the given pos as possible position for the transporter.
//
model.transport_canUnloadUnitsAt = function( uid, x,y ){
  assert( model.unit_isValidUnitId(uid) );
  assert( model.map_isValidPosition(x,y) );

	var loader 	= model.unit_data[uid];
	var pid 		= loader.owner;
	var unit;
	
	// only transporters with loads can unload things
	// TODO: is transport could be an assertion
	if( !( model.transport_isTransportUnit( uid ) && 
					model.transport_hasLoads( uid ) ) ) return false;
	
	var i = model.unit_firstUnitId( pid );
	var e = model.unit_lastUnitId(  pid );
	for( ; i<=e; i++ ){
		
		unit = model.unit_data[i];
		if( unit.owner !== INACTIVE_ID && unit.loadedIn === uid ){
			var movetp = model.data_movetypeSheets[ unit.type.movetype ];
			
			if( model.move_canTypeMoveTo(movetp,x-1,y) ) return true;
			if( model.move_canTypeMoveTo(movetp,x+1,y) ) return true;
			if( model.move_canTypeMoveTo(movetp,x,y-1) ) return true; 
			if( model.move_canTypeMoveTo(movetp,x,y+1) ) return true;
		}
	}
	
	return false;
};

// Adds unload targets for a transporter at a given position to the menu.
// 
model.transport_addUnloadTargetsToMenu = function( uid, x,y, menu ){
	assert( model.unit_isValidUnitId( uid ) );
  assert( model.map_isValidPosition(x,y) );
	
	var loader 	= model.unit_data[uid];
	var pid 		= loader.owner;
	var i 			= model.unit_firstUnitId( pid );
	var e 			= model.unit_lastUnitId( pid );
	var unit;
	
	for( ;i<=e; i++ ){
		unit = model.unit_data[i];
		
		if( unit.owner !== INACTIVE_ID && unit.loadedIn === uid ){
			var movetp = model.data_movetypeSheets[ unit.type.movetype ];
			
			if( model.move_canTypeMoveTo(movetp,x-1,y) ||
				 model.move_canTypeMoveTo(movetp,x+1,y) ||
				 model.move_canTypeMoveTo(movetp,x,y-1) ||
				 model.move_canTypeMoveTo(movetp,x,y+1) ) menu.addEntry( i, true );
		}
	}
};

// Adds unload targets for a transporter at a given position to the selection.
// 
model.transport_addUnloadTargetsToSelection = function( uid, x,y, loadId, selection ){
	assert( model.unit_isValidUnitId( uid ) );
	assert( model.unit_isValidUnitId( loadId ) );
  assert( model.map_isValidPosition(x,y) );
  
	var loader = model.unit_data[uid];
	var movetp = model.data_movetypeSheets[ model.unit_data[ loadId ].type.movetype ];
	
	if( model.move_canTypeMoveTo(movetp,x-1,y) ) selection.setValueAt( x-1,y, 1 );
	if( model.move_canTypeMoveTo(movetp,x+1,y) ) selection.setValueAt( x+1,y, 1 );
	if( model.move_canTypeMoveTo(movetp,x,y-1) ) selection.setValueAt( x,y-1, 1 );
	if( model.move_canTypeMoveTo(movetp,x,y+1) ) selection.setValueAt( x,y+1, 1 );
};

// Returns true if a tranporter with id tid can load the unit with the id lid. This function 
// also calculates the resulting weight if the transporter would load the unit. If the 
// calculated weight is greater than the maxiumum loadable weight false will be returned.
// 
model.transport_canLoadUnit = function( lid, tid ){
	assert( model.unit_isValidUnitId( lid ) );
	assert( model.unit_isValidUnitId( tid ) );
	assert( tid !== lid );
	
	var transporter = model.unit_data[ tid ];
	var load 				= model.unit_data[ lid ];

	assert( model.transport_isTransportUnit(tid) );
	assert( load.loadedIn !== tid );

	// `loadedIn` of transporter units marks the amount of loads `LOADS = (LOADIN + 1) + MAX_LOADS`
	if( transporter.loadedIn + transporter.type.maxloads + 1 === 0 ) return false; 
	
	return ( transporter.type.canload.indexOf( load.type.movetype ) !== -1 );
};

// Returns true if the unit with id tid is a traensporter, else false.
//
model.transport_isTransportUnit = function( tid ){
	assert( model.unit_isValidUnitId( tid ) );

	return typeof model.unit_data[ tid ].type.maxloads === "number";
};
