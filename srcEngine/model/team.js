controller.registerInvokableCommand("transferMoney");
controller.registerInvokableCommand("transferUnit");
controller.registerInvokableCommand("transferProperty");

controller.defineEvent("transferMoney");
controller.defineEvent("transferUnit");
controller.defineEvent("transferProperty");

model.MONEY_TRANSFER_STEPS = [
	1000,
	2500,
	5000,
	10000,
	25000,
	50000
];

model.canTransferMoneyToTile = function( pid, x,y ){
	var ref;
	
	if( model.players[ pid ].gold < model.MONEY_TRANSFER_STEPS[0] ) return false;
	
	// CHECK UNIT
	ref = model.unitPosMap[x][y];
	if( ref === null || ref.owner === pid ){
		
		// CHECK PROPERTY
		ref = model.propertyPosMap[x][y];
		if( ref !== null && ref.owner !== pid && ref.owner !== -1 ){
			return true;
		}
		
		return false;
	}
	
	return true;
};

// Adds all target player ids for a tranfer process in a menu.
//
// @param {Number} uid
// @param {Array<Number>} steps
// @param {Menu} menu
//
model.addGoldTransferEntries = function( pid, menu ){
	var availGold = model.players[ pid ].gold;
	for( var i=0,e=model.MONEY_TRANSFER_STEPS.length; i<e; i++ ){
		if( availGold >= model.MONEY_TRANSFER_STEPS[i] ){
			data.menu.addEntry( model.MONEY_TRANSFER_STEPS[i] );
		}
	}
};

// Transfers money from one player to another player.
// 
// @param {Number} splid id of the source player
// @param {Number} tplid id of the target player
// @param {Number} money amount of money
model.transferMoney = function( spid, tpid, money ){
	
	// check parameters
	if( !model.isValidPlayerId(spid) || !model.isValidPlayerId(tpid) ){
		model.criticalError( 
			error.ILLEGAL_PARAMETERS,
			error.UNKNOWN_PLAYER_ID
		);
	}
	
	var sPlayer = model.players[ spid ];
	var tPlayer = model.players[ tpid ];
	
	// check parameters
	if( money > sPlayer.gold ){
		model.criticalError( 
			error.ILLEGAL_PARAMETERS,
			error.NOT_ENOUGH_MONEY
		);
	}
	
	// Transfer gold from one player to the other player
	sPlayer.gold -= money;
	tPlayer.gold += money;
	
	controller.events.transferMoney( spid, tpid, money ); 
};

model.transferMoneyByTile = function( spid, x,y, money ){
	var owner = ( model.propertyPosMap[x][y] !== null)? model.propertyPosMap[x][y].owner : model.unitPosMap[x][y].owner;
	model.transferMoney( spid, owner, money );
};

// Transfers an unit from one player to another player.
// 
// @param {Number} suid
// @param {Number} tplid 
model.transferUnit = function( suid, tplid ){
	var selectedUnit = model.units[suid];
	var tx           = selectedUnit.x;
	var ty           = selectedUnit.y;
	var opid         = selectedUnit.owner;
	
	selectedUnit.owner = INACTIVE_ID;
	
	// Remove vision
	if( model.players[tplid].team !== model.players[opid].team ){
		model.modifyVisionAt(tx, ty, selectedUnit.type.vision, -1);
	}
	
	model.clearUnitPosition( suid );
	model.createUnit( tplid, tx, ty, selectedUnit.type.ID );
	
	// TODO
	var targetUnit      = model.unitPosMap[ tx ][ ty ];
	targetUnit.hp       = selectedUnit.hp;
	targetUnit.ammo     = selectedUnit.ammo;
	targetUnit.fuel     = selectedUnit.fuel;
	targetUnit.exp      = selectedUnit.exp;
	targetUnit.type     = selectedUnit.type;
	targetUnit.x        = tx;
	targetUnit.y        = ty;
	targetUnit.loadedIn = selectedUnit.loadedIn;
	
	controller.events.transferUnit( suid, tplid ); 
};

// Returns true when a given unit id is transferable to another player.
//
// @param {Number} uid
//
model.isUnitTransferable = function( uid ){
	if( model.hasLoadedIds( uid ) ) return false; 
	return true;
};

// Adds all target player ids for a tranfer process in a menu.
//
// @param {Number} uid
//
model.addTransferTargets = function( pid, menu ){
	for( var i=0,e=MAX_PLAYER; i<e; i++ ){
		if( i !== pid && model.players[i].team !== INACTIVE_ID ){
			menu.addEntry(i, true );
		}
	}
};

// Transfers a property from one player to another player.
//
// @param {Number} sprid
// @param {Number} tplid
//
model.transferProperty = function( sprid, tplid ){
	var prop =  model.properties[sprid];
	prop.owner = tplid;
	
	var x;
	var y;
	var xe = model.mapWidth;
	var ye = model.mapHeight;
	
	for( x=0 ;x<xe; x++ ){
		for( y=0 ;y<ye; y++ ){
			if( model.propertyPosMap[x][y] === prop ){
				// TODO fog?
			}
		}
	}
	
	controller.events.transferProperty( sprid, tplid ); 
};

// Returns true when a given property id is transferable to another player.
//
// @param {Number} prid
//
model.isPropertyTransferable = function( prid ){
	return !model.properties[prid].type.notTransferable;
};
