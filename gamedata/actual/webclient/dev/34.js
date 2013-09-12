// # Factory module

// ### Meta Data

controller.registerInvokableCommand( "buildUnit" );

controller.defineEvent( "buildUnit" );

model.unitTypeParser.addHandler( function( sheet ){
	if( !util.expectNumber( sheet, "cost", true, true, 0, 99999 ) ) return false;
} );

model.tileTypeParser.addHandler( function( sheet ){
	if( util.expectArray( sheet, "builds", false ) === util.expectMode.DEFINED ) {
		var list = sheet.builds;
		for( var i = 0, e = list.length; i < e; i++ ) {
			if( !util.expectString( list, i, true ) ) return false;
		}
	}
} );

// ---

// ### Logic

// Contructs a unit for a player.
model.buildUnit = function( x, y, type ){
	
	// get factory object
	var prop = model.getPropertyByPos( x, y );
	if( !prop ) {
		model.criticalError( constants.error.ILLEGAL_PARAMETERS, constants.error.PROPERTY_NOT_FOUND );
	}
	
	// cannot be a neutral factory
	if( prop.owner === constants.INACTIVE_ID ) {
		model.criticalError( constants.error.ILLEGAL_PARAMETERS, constants.error.UNKNOWN_PLAYER_ID );
	}
	
	// invoke introduction event
	var evCb = controller.events.buildUnit;
	if( evCb ) evCb( x, y, type );
	
	var uid = model.createUnit( model.turnOwner, x, y, type );
	var cost = model.unitTypes[ type ].cost;
	var pl = model.players[ prop.owner ];
	
	// check money, if the buyer does not have enough money 
	// then the game state is broken
	if( pl.gold < cost ){
		model.criticalError( 
			constants.error.ILLEGAL_DATA, 
			constants.error.NOT_ENOUGH_MONEY 
		)
	};
	
	pl.gold -= cost;
	
	// factory builds reduces the man power of the factory owner
	model.decreaseManpower( model.turnOwner );
	
	model.markUnitNonActable( uid );
};

model.propertyCanBuild = function( prid ){
	if( !model.isFactory( prid ) ) return false;
	
	var pid = model.properties[prid].owner;
	if( !model.hasLeftManpower( pid )  ) return false;
  if( !model.hasFreeUnitSlots( pid ) ) return false;
    
	return true;
};

model.isFactory = function( prid ){
	return model.properties[prid].type.builds;
};

model.getBuildMenu = function( prid, menu ){
	if( !model.isFactory(prid) ){
		model.criticalError( 
			constants.error.ILLEGAL_DATA, 
			constants.error.FACTORY_EXPECTED
		);
	}
	
	var property  = model.properties[prid];
	var availGold = model.players[ property.owner ].gold;
	var unitTypes = model.listOfUnitTypes;
	var bList = property.type.builds;
	
	for( var i=0,e=unitTypes.length; i<e; i++ ){
		var key  = unitTypes[i];
		var type = model.unitTypes[key];
		
		// TODO LATER DISABLE ACTION ONLY
		if( type.cost > availGold ) continue;
		
		if( bList.indexOf( type.movetype ) === -1 ) continue;
		
		// TODO FIND BETTER SOLUTION
		// if( model.rules.blockedUnits.indexOf(uType) !== -1 ) return false;
		
		menu.addEntry( key );
	}
};