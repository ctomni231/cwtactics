/**
 * List that contains all player instances. An inactive player is marked 
 * with {@link CWT_INACTIVE_ID} as team number.
 */
model.players = util.list( CWT_MAX_PLAYER+1, function( index ){
  var neutral = (index === CWT_MAX_PLAYER );
  return {
    gold: 0,
    team: ( neutral )? 9999 : CWT_INACTIVE_ID,
    name: ( neutral )? "NEUTRAL" : null
  };
});

/**
 * Returns true if the given id is a neutral player, else false.
 * 
 * @param {Number} id player id
 * @deprecated will be removed with version 0.3 because the neutral player will
 *             be dropped.
 */
model.isNeutralPlayer = function( id ){
  return model.neutralPlayerId === id;
};

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
 * Returns the neutral player id.
 * 
 * @deprecated will be dropped in version 0.3
 */
model.neutralPlayerId = model.players.length-1;

/**
 * Returns true if player id A is in the same team 
 * as player id B, else false. 
 * 
 * @param {Number} pidA player id
 * @param {Number} pidB player id
 */
model.alliedPlayers = function( pidA, pidB ){
  return model.players[pidA].team === model.players[pidB].team;
};

/**
 * Returns true if player id A is not in the same 
 * team as player id B, else false. 
 * 
 * @param {Number} pidA player id
 * @param {Number} pidB player id
 */
model.enemyPlayers = function( pidA, pidB ){
  return model.players[pidA].team !== model.players[pidB].team;
};