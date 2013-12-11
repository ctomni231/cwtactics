// commands
controller.action_registerCommands("team_transferMoney");
controller.action_registerCommands("team_transferUnit");
controller.action_registerCommands("team_transferProperty");

// events
controller.event_define("team_transferMoney");
controller.event_define("team_transferUnit");
controller.event_define("team_transferProperty");

// Different available money transfer steps.
//
model.team_MONEY_TRANSFER_STEPS = [1000,2500,5000,10000,25000,50000];

// Returns `true` when a player can transfer money to a tile owner.
//
model.team_canTransferMoneyToTile = function( pid, x,y ){
	assert( model.map_isValidPosition(x,y) );
	assert( model.player_isValidPid(pid) );
  
	var ref;
	
	if( model.player_data[ pid ].gold < model.team_MONEY_TRANSFER_STEPS[0] ) return false;
	
	// check unit first
	ref = model.unit_posData[x][y];
	if( ref === null || ref.owner === pid ){
		
		// check property
		ref = model.property_posMap[x][y];
		if( ref !== null && ref.owner !== pid && ref.owner !== -1 ){
			return true;
		}
		
		return false;
	}
	
	return true;
};

// Adds all target player ids for a tranfer process in a menu.
//
model.team_addGoldTransferEntries = function( pid, menu ){
	assert( model.player_isValidPid(pid) );
  
	var availGold = model.player_data[ pid ].gold;
	for( var i=0,e=model.team_MONEY_TRANSFER_STEPS.length; i<e; i++ ){
		if( availGold >= model.team_MONEY_TRANSFER_STEPS[i] ){
			menu.addEntry( model.team_MONEY_TRANSFER_STEPS[i] );
		}
	}
};

// Transfers money from one player to another player.
// 
model.team_transferMoney = function( spid, tpid, money ){
	assert( model.player_isValidPid(spid) );
	assert( model.player_isValidPid(tpid) );
	assert( util.inRange( money,
		model.team_MONEY_TRANSFER_STEPS[0],
		model.team_MONEY_TRANSFER_STEPS[model.team_MONEY_TRANSFER_STEPS.length-1]
	));

	var sPlayer = model.player_data[ spid ];
	var tPlayer = model.player_data[ tpid ];
	
  util.expect( util.expect.isTrue, (money<=sPlayer) );
  
	// Transfer gold from one player to the other player
	sPlayer.gold -= money;
	tPlayer.gold += money;
	
	controller.events.team_transferMoney( spid, tpid, money ); 
};

// Transfers money from one player to another by a given tile.
//
model.team_transferMoneyByTile = function( spid, x,y, money ){
	assert( model.player_isValidPid(spid) );
	assert( model.map_isValidPosition(x,y) );
	assert( util.inRange( money,
		model.team_MONEY_TRANSFER_STEPS[0],
		model.team_MONEY_TRANSFER_STEPS[model.team_MONEY_TRANSFER_STEPS.length-1]
	));
    
	var owner = ( model.property_posMap[x][y] !== null)? 
      model.property_posMap[x][y].owner : 
      model.unit_posData[x][y].owner;
  
	model.team_transferMoney( spid, owner, money );
};

// Transfers an unit from one player to another player.
// 
model.team_transferUnit = function( suid, tplid ){
	assert( model.unit_isValidUnitId(suid) );
	assert( model.player_isValidPid(tplid) );

	var selectedUnit = model.unit_data[suid];
	var tx           = selectedUnit.x;
	var ty           = selectedUnit.y;
	var opid         = selectedUnit.owner;
	
	selectedUnit.owner = INACTIVE_ID;
	
	// Remove vision
	if( model.player_data[tplid].team !== model.player_data[opid].team ){
		model.fog_modifyVisionAt(tx, ty, selectedUnit.type.vision, -1);
	}
	
	model.move_clearUnitPosition( suid );
	model.unit_create( tplid, tx, ty, selectedUnit.type.ID );
	
	// TODO
	var targetUnit      = model.unit_posData[ tx ][ ty ];
	targetUnit.hp       = selectedUnit.hp;
	targetUnit.ammo     = selectedUnit.ammo;
	targetUnit.fuel     = selectedUnit.fuel;
	targetUnit.exp      = selectedUnit.exp;
	targetUnit.type     = selectedUnit.type;
	targetUnit.x        = tx;
	targetUnit.y        = ty;
	targetUnit.loadedIn = selectedUnit.loadedIn;
	
	controller.events.team_transferUnit( suid, tplid ); 
};

// Returns true when a given unit id is transferable to another player.
//
model.team_isUnitTransferable = function( uid ){
	assert( model.unit_isValidUnitId(uid) );
  
	return model.transport_hasLoads( uid );
};

// Adds all target player ids for a tranfer process in a menu.
//
model.team_addTransferTargets = function( pid, menu ){
	assert( model.player_isValidPid(pid) );

	for( var i=0,e=MAX_PLAYER; i<e; i++ ){
		if( i !== pid && model.player_data[i].team !== INACTIVE_ID ){
			menu.addEntry(i, true );
		}
	}
};

// Transfers a property from one player to another player.
//
model.team_transferProperty = function( sprid, tplid ){
	assert( model.property_isValidPropId(sprid) );
	assert( model.player_isValidPid(tplid) );

	var prop =  model.property_data[sprid];
	prop.owner = tplid;
	
	var x;
	var y;
	var xe = model.map_width;
	var ye = model.map_height;
	
	for( x=0 ;x<xe; x++ ){
		for( y=0 ;y<ye; y++ ){
			if( model.property_posMap[x][y] === prop ){
				// TODO fog?
			}
		}
	}
	
	controller.events.team_transferProperty( sprid, tplid ); 
};

// Returns true when a given property id is transferable to another player.
//
model.team_isPropertyTransferable = function( prid ){
	assert( model.property_isValidPropId(prid) );

	return !model.property_data[prid].type.notTransferable;
};