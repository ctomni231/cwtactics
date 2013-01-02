model.players = util.list( CWT_MAX_PLAYER+1, function( index ){
  var neutral = (index === CWT_MAX_PLAYER );
  return {
    gold: 0,
    team: ( neutral )? 9999 : CWT_INACTIVE_ID,
    name: ( neutral )? "NEUTRAL" : null
  }
});

model.isNeutralPlayer = function( id ){
  return model.neutralPlayerId === id;
};

/**
 * Returns the neutral player id.
 */
model.neutralPlayerId = model.players.length-1;

model.alliedPlayers = function( pidA, pidB ){
  return model.players[pidA].team === model.players[pidB].team;
};

model.enemyPlayers = function( pidA, pidB ){
  return model.players[pidA].team !== model.players[pidB].team;
};