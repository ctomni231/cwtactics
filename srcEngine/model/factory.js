// commands
controller.action_registerCommands( "factory_produceUnit" );

// events
controller.event_define( "factory_produceUnit" );

// Contructs a unit for a player. At least one slot must be free to do this.
//
model.factory_produceUnit = function( x, y, type ){
  if( DEBUG ) util.log("factory at postion (",x,",",y,") produces a",type);
  
  assert( model.map_isValidPosition(x,y) );
  assert( model.data_unitSheets.hasOwnProperty(type));

	// get factory object
	var prop = model.property_posMap[x][y];
  assert( prop !== null );
  
	controller.events.factory_produceUnit( x, y, type );
	
	var uid  = model.unit_create( model.round_turnOwner, x, y, type );
	var cost = model.data_unitSheets[ type ].cost;
	var pl   = model.player_data[ prop.owner ];
		
	pl.gold -= cost;
  assert( pl.gold >= 0 );
	
	model.manpower_decreaseManpower( model.round_turnOwner );
	model.actions_markUnitNonActable( uid );
};

// Returns `true` when the given factory object (by its `prid`) is a factory and can produce 
// something technically, else `false`.
//
model.factory_canProduceSomething = function( prid ){  
	if( !model.factory_isFactory( prid ) ) return false;
	
	var pid = model.property_data[prid].owner;
  assert( model.player_isValidPid(pid) );
  
	if( !model.manpower_hasLeftManpower( pid )  ) return false;
  if( !model.unit_hasFreeSlots( pid ) ) return false;
    
	return true;
};

// Returns `true` when the given factory object (by its `prid`) is a factory, else `false`.
//
model.factory_isFactory = function( prid ){
  assert( model.property_isValidPropId(prid) );
  
	return model.property_data[prid].type.builds;
};

// Generates the build menu for a given factory object (by its `prid`).
//
model.factoryGenerateBuildMenu = function( prid, menu ){
  assert( model.property_isValidPropId(prid) );
  assert( model.factory_isFactory(prid));
	
	var property   = model.property_data[prid];
  
  // the factory must be ownerd by someone
  assert( model.player_isValidPid(property.owner) );
  
	var availGold  = model.player_data[ property.owner ].gold;
	var unitTypes  = model.data_unitTypes;
	var bList      = property.type.builds;
	
	for( var i=0,e=unitTypes.length; i<e; i++ ){
		var key  = unitTypes[i];
		var type = model.data_unitSheets[key];
		
		// TODO LATER DISABLE ACTION ONLY
		if( type.cost > availGold ) continue;
		
		if( bList.indexOf( type.movetype ) === -1 ) continue;
		
		// TODO FIND BETTER SOLUTION
		// if( model.rules.blockedUnits.indexOf(uType) !== -1 ) return false;
		
		menu.addEntry( key );
	}
};
