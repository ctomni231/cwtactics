controller.registerInvokableCommand("noTeamLeft");
controller.registerInvokableCommand("playerGivesUp");
controller.registerInvokableCommand("playerLooses");

controller.defineEvent("playerGivesUp");
controller.defineEvent("playerLooses");
controller.defineEvent("noTeamLeft");

// Different relationship modes between two objects
model.relationModes = {
	SAME_OBJECT: -1,
	NONE:         0,
	OWN:          1,
	ALLIED:       2,
	TEAM:         3,
	ENEMY:        4
};

/**
 * List that contains all player instances. An inactive player is marked 
 * with `constants.INACTIVE_ID` as team number.
 */
model.players = util.list( constants.MAX_PLAYER, function( index ){
	return {
		gold: 0,
		team: constants.INACTIVE_ID,
		name: null
	};
});

// Define persistence handler
controller.persistenceHandler(
	
	// load
	function(dom){
		var players = dom.plys;
		var data, player, id;
		
		// reset player data
		for( var i=0,e=constants.MAX_PLAYER; i<e; i++ ){
			player = model.players[i];
			player.name = null;
			player.gold = 0;
			player.team = constants.INACTIVE_ID;
		}
		
		// set player data if given
		if( players ){
			for( var i=0,e=players.length; i<e; i++ ){
				data = players[i];
				
				// check data
				var fail = false;
				if( !fail && !util.expectNumber( data, 0, true, true, 0, constants.MAX_PLAYER-1 ) ) fail = true;
				if( !fail && !util.expectString( data, 1, true ) ) fail = true;
				if( !fail && !util.expectNumber( data, 2, true, true, 0, 999999 ) ) fail = true;
				if( !fail && !util.expectNumber( data, 3, true, true, 0, constants.MAX_PLAYER-1 ) ) fail = true;
				
				// call error when data is illegal
				if( fail ){
					model.criticalError( constants.error.ILLEGAL_MAP_FORMAT, constants.error.SAVEDATA_PLAYER_MISSMATCH );
				}
				
				// set player data
				player = model.players[data[0]];
				player.name = data[1];
				player.gold = data[2];
				player.team = data[3];
			}
		}
	},
	
	// save
	function(dom){
		
	}
);

// Returns true if a given player id is valid or false if not
//
model.isValidPlayerId = function( pid ){
	if( pid < 0 || pid >= constants.MAX_PLAYER ) return false;
	return model.players[pid].team !== constants.INACTIVE_ID;
};

// Extracts the identical number from an player object.
//
// @param {Object} player player object
//
model.extractPlayerId = function( player ){
	var index = model.players.indexOf( player );
	
	// player was not found in the model
	if( index === -1 ) model.criticalError(
		constants.error.ILLEGAL_PARAMETERS,
		constants.error.UNKNOWN_PLAYER_OBJECT
	);
	
	return index;
};

// A player has loosed the game round due a specific reason. This function removes all of his units and properties. 
// Furthermore the left teams will be checked. If only one team is left then the end game event will be invoked.
// 
// @param {Number} pid id of the player
// 
model.playerLooses = function( pid ){
	var i,e;
	
	// Invoke event
	var evCb = controller.events.playerLooses;
	if( evCb ) evCb( pid );
	
	// remove all unit
	i = model.getFirstUnitSlotId( pid ); 
	e = model.getLastUnitSlotId( pid );
	for( ; i<e; i++ ){
		if( model.units[i].owner !== constants.INACTIVE_ID ) model.destroyUnit(i);
	}
	
	// remove all properties
	i = 0; 
	e = model.properties.length;
	for( ; i<e; i++ ){
		var prop = model.properties[i];
		if( prop.owner === pid ){
			prop.owner = -1;
			
			// change type when the property is a 
			// changing type property
			var changeType = prop.type.changeAfterCaptured;
			if( changeType ) model.changePropertyType( i, changeType );
		}
	}
	
	// mark player slot as remove by removing
	// its team reference
	model.players[pid].team = -1;
	
	// check left teams
	var _teamFound = -1;
	i = 0;
	e = model.players.length;
	for( ; i<e; i++ ){
		var player = model.players[i];
		
		if( player.team !== -1 ){
			
			// found alive player
			if( _teamFound === -1 ) _teamFound = player.team;
			else if( _teamFound !== player.team ){
				_teamFound = -1;
				break;
			}
				}
	}
	
	// when no opposite teams are found then
	// the game has ended
	if( _teamFound !== -1 ){
		controller.localInvokement("noTeamLeft");
	}
};

// Returns true if there is an unit with a given relationship on a tile at a given position (x,y).
// 
// @param {Number} x
// @param {Number} y
// @param {Number} pid
// @param {model.relationModes} mode check mode
// @returns {Boolean}
// 
model.thereIsUnitCheck = function( x,y,pid,mode ){
	if( !model.isValidPosition(x,y) ) return false;
	
	var unit = model.unitPosMap[x][y];
	return unit !== null && model.relationShipCheck(pid,unit.owner) === mode;
};

// Returns true if there is an unit with a given relationship on a tile at a given position (x,y).
// 
// @param {Number} x
// @param {Number} y
// @param {Number} pid
// @param {model.relationModes} mode check mode
// @returns {Boolean}
// 
model.thereIsPropertyCheck = function( x,y,pid,mode ){
	if( !model.isValidPosition(x,y) ) return false;
	
	var property = model.propertyPosMap[x][y];
	return property !== null && model.relationShipCheck(pid,property.owner) === mode;
};

// Returns true if there is an unit with a given relationship on a tile at a given position (x,y).
// 
// @param {Number} pidA
// @param {Number} pidB
// @return {model.relationModes} mode
// 
model.relationShipCheck = function( pidA, pidB ){
	
	// none
	if( pidA === null || pidB === null ) return model.relationModes.NONE;
	if( pidA === -1   || pidB === -1   ) return model.relationModes.NONE;
	if( model.players[pidA].team === -1 || model.players[pidB].team === -1 ) return model.relationModes.NONE;
	
	// own
	if( pidA === pidB ) return model.relationModes.OWN;
	
	var teamA = model.players[pidA].team;
	var teamB = model.players[pidB].team;
	if( teamA === -1 || teamB === -1 ) return model.relationModes.NONE;
	
	// allied
	if( teamA === teamB ) return model.relationModes.ALLIED;
	
	// enemy
	if( teamA !== teamB ) return model.relationModes.ENEMY;
	
	return model.relationModes.NONE;
};

// Returns true if there is an unit with a given relationship in one of the neighbour tiles at a given position (x,y).
// 
// @param {Number} pid
// @param {Number} x
// @param {Number} y
// @param {model.relationModes} mode check mode
// @returns {Boolean}
// 
// @example
//       x
//     x o x
//       x
// 
model.relationShipCheckUnitNeighbours = function( pid, x,y , mode ){
	var check = model.relationShipCheck;
	
	var ownCheck = ( mode === model.relationModes.OWN );
	var i = 0;
	var e = model.units.length;
	
	// enhance lookup when only 
	// own units are checked
	if( ownCheck ){
		i = model.getFirstUnitSlotId(pid);
		e = model.getLastUnitSlotId(pid);
	}
	
	// check all
	for( ; i<e; i++ ){
		
		// true when neighbor is given and mode is correct
		if( model.unitDistance( sid, i ) === 1 ){
			if( ownCheck || check( pid, model.units[i].owner ) === mode ) return true;
		}
	}
	
	return false;
};

// This function yields the game for the turn owner and invokes directly the 
// `nextTurn` action. 
//
// **Allowed to be called directly by the client.**
//
model.playerGivesUp = function(){
	model.playerLooses( model.turnOwner );
	model.nextTurn();
	
	// TODO: check this here
	// if model.playerGivesUp was called from network context
	// and the turn owner in in the local player instances then
	// it's an illegal action 
	
	controller.events.playerGivesUp( model.turnOwner );
};

// Invoked when the game ends because of a battle victory over 
// all enemy players. 
//
model.noTeamLeft = function(){
	controller.endGameRound();
	
	controller.events.noTeamLeft();
};