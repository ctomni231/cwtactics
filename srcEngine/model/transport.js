controller.registerInvokableCommand("loadUnitInto");
controller.registerInvokableCommand("unloadUnitFrom");

controller.defineEvent("loadUnitInto");
controller.defineEvent("unloadUnitFrom");

// ---

// ### Logic 

// Defines some type sheet requirements for transport logics
model.unitTypeParser.addHandler(function(sheet){
	var list,i1,e1;
	
	if( !util.expectBoolean(sheet,"suppliesloads",false) ) return false;
	
	if( util.expectArray(sheet,"canload",false) === util.expectMode.DEFINED ){
		if( !util.expectNumber(sheet,"maxloads",true,true,1,5) ) return false;
		
		list = sheet.canload;
		for( i1=0,e1=list.length; i1<e1; i1++ ){
			if( !util.expectString(list,i1,true) ) return false;  
		} 
	}
});

// Has a transporter unit with id tid loaded units? Returns true if yes, else
// false.
//
// @param {Number} tid transporter id
//
model.hasLoadedIds = function( tid ){
	var pid = model.units[tid].owner;
	for( var i=model.getFirstUnitSlotId(pid), e=model.getLastUnitSlotId(pid); i<e; i++ ){
		if( i !== tid ){
			
			var unit = model.units[ i ];
			if( unit !== null && unit.loadedIn === tid ) return true;
		}
	}
	
	return false;
};

// Returns true if the unit with the id lid is loaded by a transporter unit
// with id tid.
//
// @param {Number} lid load id
// @param {Number} tid transporter id
// 
model.isLoadedBy = function( lid, tid ){
	return model.units[ lid ].loadedIn === tid;
};

// Loads the unit with id lid into a tranporter with the id tid.
//
// @param {Number} lid load id
// @param {Number} tid transporter id
// 
model.loadUnitInto = function( loadId, transportId ){
	if( !model.canLoad( loadId, transportId ) ){
		util.raiseError("transporter unit",transportId,"cannot load unit",loadId);
	}
	
	model.units[ loadId ].loadedIn = transportId;
	model.units[ transportId ].loadedIn--;
	
	controller.events.loadUnitInto( loadId, transportId );
};

// Unloads the unit with id lid from a tranporter with the id tid.
//
// @param {Number} lid
// @param {Number} tid
// 
model.unloadUnitFrom = function( transportId, trsx, trsy, loadId, tx,ty ){
	
	// error check: is really loaded by `transportId` ?
	if( model.units[ loadId ].loadedIn !== transportId ) model.criticalError( 
		error.ILLEGAL_PARAMETERS,
		error.LOAD_IS_NOT_IN_TRANSPORTER
	);
	
	// TODO: remove this later
	// trapped ?
	if( tx === -1 || ty === -1 ) return;
	
	// remove transport link
	model.units[ loadId ].loadedIn = -1;
	model.units[ transportId ].loadedIn++;
	
	// extract mode code id
	var moveCode;
	if( tx < trsx ) moveCode = model.moveCodes.LEFT;
	else if( tx > trsx ) moveCode = model.moveCodes.RIGHT;
		else if( ty < trsy ) moveCode = model.moveCodes.UP;
		else if( ty > trsy ) moveCode = model.moveCodes.DOWN;
			
			controller.events.unloadUnitFrom( transportId, trsx, trsy, loadId, tx,ty );
	
	// move load out of the transporter
	model.moveUnit([moveCode], loadId, trsx, trsy);
	model.markUnitNonActable( loadId );
};

// Returns true if a transporter unit can unload one of it's loads at 
// a given position. This functions understands the given pos as possible
// position for the transporter.
//
// @param {Number} uid
// @param {Number} x
// @param {Number} y
// 
model.canUnloadUnitAt = function( uid, x,y ){
	var loader = model.units[uid];
	var pid = loader.owner;
	var unit;
	
	if( !( model.isTransport( uid ) && model.hasLoadedIds( uid ) ) ) return false;
	
	var i = model.getFirstUnitSlotId( pid );
	var e = model.getLastUnitSlotId( pid );
	for( ; i<=e; i++ ){
		
		unit = model.units[i];
		if( unit.owner !== INACTIVE_ID && unit.loadedIn === uid ){
			var movetp = model.moveTypes[ unit.type.movetype ];
			
			if( model.canTypeMoveTo(movetp,x-1,y) ) return true;
			if( model.canTypeMoveTo(movetp,x+1,y) ) return true;
			if( model.canTypeMoveTo(movetp,x,y-1) ) return true; 
			if( model.canTypeMoveTo(movetp,x,y+1) ) return true;
		}
	}
	
	return false;
};

//
// @param {Number} uid
// @param {Number} x
// @param {Number} y
// @param {Menu} menu
// 
model.addUnloadTargetsToMenu = function( uid, x,y, menu ){
	if( !( model.isTransport( uid ) ) ){
		model.criticalError( 
			error.ILLEGAL_PARAMETERS,
			error.ILLEGAL_PARAMETERS
		);
	}
	
	var loader = model.units[uid];
	var pid = loader.owner;
	var i = model.getFirstUnitSlotId( pid );
	var e = model.getLastUnitSlotId( pid );
	var unit;
	
	for( ;i<=e; i++ ){
		unit = model.units[i];
		
		if( unit.owner !== INACTIVE_ID && unit.loadedIn === uid ){
			var movetp = model.moveTypes[ unit.type.movetype ];
			
			if( model.canTypeMoveTo(movetp,x-1,y) ||
				 model.canTypeMoveTo(movetp,x+1,y) ||
				 model.canTypeMoveTo(movetp,x,y-1) ||
				 model.canTypeMoveTo(movetp,x,y+1) ) menu.addEntry( i, true );
		}
	}
};

//
// @param {Number} uid
// @param {Number} x
// @param {Number} y
// @param {Menu} menu
// 
model.addUnloadTargetsToSelection = function( uid, x,y, loadId, selection ){
	var loader = model.units[uid];
	var movetp = model.moveTypes[ model.units[ loadId ].type.movetype ];
	
	if( model.canTypeMoveTo(movetp,x-1,y) ) selection.setValueAt( x-1,y, 1 );
	if( model.canTypeMoveTo(movetp,x+1,y) ) selection.setValueAt( x+1,y, 1 );
	if( model.canTypeMoveTo(movetp,x,y-1) ) selection.setValueAt( x,y-1, 1 );
	if( model.canTypeMoveTo(movetp,x,y+1) ) selection.setValueAt( x,y+1, 1 );
};

// Returns true if a tranporter with id tid can load the unit with the id
// lid. This function also calculates the resulting weight if the transporter
// would load the unit. If the calculated weight is greater than the maxiumum
// loadable weight false will be returned.
// 
// @param {Number} lid load id
// @param {Number} tid transporter id
// 
model.canLoad = function( lid, tid ){
	
	// error check: transporters cannot load itself
	if( lid === tid ) model.criticalError( 
		error.ILLEGAL_PARAMETERS,
		error.TRANSPORTER_CANNOT_LOAD_ITSELF
	);
	
	var transporter = model.units[ tid ];
	
	// error check: non-transporters cannot load anything
	if( util.notIn( "maxloads", transporter.type ) ) model.criticalError( 
		error.ILLEGAL_PARAMETERS,
		error.TRANSPORTER_EXPECTED
	);
	
	var load = model.units[ lid ];
	
	// `loadedIn` of transporter units marks the amount of loads
	// ```LOADS = (LOADIN + 1) + MAX_LOADS```
	if( transporter.loadedIn + transporter.type.maxloads + 1 === 0 ) return false; 
	
	// is unit technically load able ?
	return ( transporter.type.canload.indexOf( load.type.movetype ) !== -1 );
};

// Returns true if the unit with id tid is a traensporter, else false.
//
// @param {Number} tid transporter id
// 
model.isTransport = function( tid ){
	
	// if `maxloads` is defined then it is a transport
	return model.units[ tid ].type.maxloads;
};
