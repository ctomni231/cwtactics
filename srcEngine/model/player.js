/**
 * @constant
 * @type Number
 */
model.MODE_SAME_OBJECT = -1;

/**
 * @constant
 * @type Number
 */
model.MODE_NONE = 0;

/**
 * @constant
 * @type Number
 */
model.MODE_OWN = 1;

/**
 * @constant
 * @type Number
 */
model.MODE_ALLIED = 2;

/**
 * @constant
 * @type Number
 */
model.MODE_TEAM = 3;

/**
 * @constant
 * @type Number
 */
model.MODE_ENEMY = 4;

/**
 * List that contains all player instances. An inactive player is marked 
 * with {@link CWT_INACTIVE_ID} as team number.
 */
model.players = util.list( CWT_MAX_PLAYER, function( index ){
  return {
    
    // BASE DATA
    gold: 0,
    team: CWT_INACTIVE_ID,
    name: null,
    
    // CO DATA
    mainCo: null,
    sideCo: null,
    power: model.INACTIVE_POWER,
    timesPowerUsed: 0
  };
});

/**
 * Extracts the identical number from an player object.
 *
 * @param player
 */
model.extractPlayerId = function( player ){
  if( player === null ){
    util.raiseError("player argument cannot be null");
  }
  
  var players = model.players;
  for( var i=0,e=players.length; i<e; i++ ){
    if( players[i] === player ) return i;
  }
  
  util.raiseError( "cannot find player", players );
};

/**
 * A player has loosed the game round due a specific reason. This function removes all of his units and properties. 
 * Furthermore the left teams will be checked. If only one team is left then the end game event will be invoked.
 * 
 * @param {Number} pid id of the player
 */
model.playerLooses = function( pid ){
  if( DEBUG ) util.log( "player",pid,"looses this game round");
  
  // REMOVE ALL UNITS
  for( var i = pid*CWT_MAX_UNITS_PER_PLAYER, e = i+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){
    if( model.units[i].owner !== CWT_INACTIVE_ID ) model.destroyUnit(i);
  }
  
  // REMOVE ALL PROPERTIES
  for( var i = 0, e = model.properties.length; i<e; i++ ){
    var prop = model.properties[i];
    if( prop.owner === pid ){
      prop.owner = -1;
      
      // SPECIALLY FOR BUILDNGS LIKE THE HQ
      var changeType = prop.type.changeAfterCaptured;
      if( changeType ){
        prop.type = model.tileTypes[changeType];
      }
    }
  }
  
  model.players[pid].team = -1;
  
  // CHECK LEFT TEAMS
  var _teamFound = -1;
  for( var i=0,e=model.players.length; i<e; i++ ){
    var player = model.players[i];
    if( player.team !== -1 ){
      
      // FOUND AN ALIVE PLAYER
      if( _teamFound === -1 ) _teamFound = player.team;
      else if( _teamFound !== player.team ){
        _teamFound = -1;
        break;
      }
        }
  }
  
  // NO OPPOSITE TEAMS LEFT ?
  if( _teamFound !== -1 ) model.noTeamLeft.callAsCommand();
};

/**
 * Returns true if there is an unit with a given relationship on a tile at a given position (x,y).
 * 
 * @param {Number} x
 * @param {Number} y
 * @param {Number} pid
 * @param {model.MODE_OWN|model.MODE_ALLIED|model.MODE_ENEMY|model.MODE_TEAM} mode check mode
 * @returns {Boolean}
 */
model.thereIsUnitCheck = function( x,y,pid,mode ){
  if( !model.isValidPosition(x,y) ) return false;
  var unit = model.unitPosMap[x][y];
  return unit !== null && model.relationShipCheck(pid,unit.owner) === mode;
};

/**
 * Returns true if there is an unit with a given relationship on a tile at a given position (x,y).
 * 
 * @param {Number} x
 * @param {Number} y
 * @param {Number} pid
 * @param {model.MODE_OWN|model.MODE_ALLIED|model.MODE_ENEMY|model.MODE_TEAM} mode check mode
 * @returns {Boolean}
 */
model.thereIsPropertyCheck = function( x,y,pid,mode ){
  if( !model.isValidPosition(x,y) ) return false;
  var property = model.propertyPosMap[x][y];
  return property !== null && model.relationShipCheck(pid,property.owner) === mode;
};

/**
 * Returns true if there is an unit with a given relationship on a tile at a given position (x,y).
 * 
 * @param {Number} pidA
 * @param {Number} pidB
 * @param {model.MODE_NONE|model.MODE_OWN|model.MODE_ALLIED|model.MODE_ENEMY} mode check mode
 */
model.relationShipCheck = function( pidA, pidB ){
  
  // NONE
  if( pidA === null || pidB === null ) return model.MODE_NONE;
  if( pidA === -1   || pidB === -1   ) return model.MODE_NONE;
  if( model.players[pidA].team === -1 || model.players[pidB].team === -1 ) return model.MODE_NONE;
  
  // OWN
  if( pidA === pidB ) return model.MODE_OWN;
  
  var teamA = model.players[pidA].team;
  var teamB = model.players[pidB].team;
  if( teamA === -1 || teamB === -1 ) return model.MODE_NONE;
  
  // ALLIED
  if( teamA === teamB ) return model.MODE_ALLIED;
  
  // ENEMY
  if( teamA !== teamB ) return model.MODE_ENEMY;
  
  return model.MODE_NONE;
};

/**
 * Returns true if there is an unit with a given relationship in one of the neighbour tiles at a given position (x,y).
 * 
 * @param {Number} pid
 * @param {Number} x
 * @param {Number} y
 * @param {model.MODE_OWN|model.MODE_ALLIED|model.MODE_ENEMY|model.MODE_TEAM} mode check mode
 * @returns {Boolean}
 * 
 * @example
 *       x
 *     x o x
 *       x
 */
model.relationShipCheckUnitNeighbours = function( pid, x,y , mode ){
  var check = model.relationShipCheck;
  
  // LEFT
  if( x > 0 && model.unitPosMap[x-1][y] !== null && 
     check( pid, model.unitPosMap[x-1][y].owner ) === mode ) return true; 
  
  // UP
  if( y > 0 && model.unitPosMap[x][y-1] !== null && 
     check( pid, model.unitPosMap[x][y-1].owner ) === mode ) return true; 
  
  // RIGHT
  if( x < model.mapWidth-1 && model.unitPosMap[x+1][y] !== null && 
     check( pid, model.unitPosMap[x+1][y].owner ) === mode ) return true; 
  
  // DOWN
  if( y < model.mapHeight-1 && model.unitPosMap[x][y+1] !== null && 
     check( pid, model.unitPosMap[x][y+1].owner ) === mode ) return true; 
  
  return false;
};

/**
 * Allowed for the client. 
 */
model.playerGivesUp = function(){
  model.playerLooses( model.turnOwner );
  model.nextTurn();
};

model.noTeamLeft = function(){
  controller.endGameRound();
};