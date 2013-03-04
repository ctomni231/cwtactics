/**
 * Represents the current action day in the game. The day attribute increases
 * everytime if the first player starts its turn.
 */
model.day = 0;

/**
 * Holds the identical number of the current turn owner.
 */
model.turnOwner = -1;

/**
 * Holds the identical numbers of all objects that can act during the turn.
 * After a unit has acted, it should be removed from this list with
 * {@link data.markAsUnusable}.
 */
model.leftActors = util.list( CWT_MAX_UNITS_PER_PLAYER, false );

/**
 * Returns true if the selected uid can act in the current active turn,
 * else false.
 *
 * @param uid selected unit identical number
 */
model.canAct = function( uid ){
  var startIndex = model.turnOwner * CWT_MAX_UNITS_PER_PLAYER;

  // NOT THE OWNER OF THE CURRENT TURN
  if( uid >= startIndex + CWT_MAX_UNITS_PER_PLAYER || uid < startIndex ){

    return false;
  }

  var index = uid - startIndex;
  return model.leftActors[ index ] === true;
};

/**
 * Returns true if the given player id is the current turn owner.
 *
 * @param pid player id
 */
model.isTurnOwner = function( pid ){
  return model.turnOwner === pid;
};

/**
 * 
 *
 * @param {Number} v number in days
 */
model.daysToTurns = function( v ){
  return model.players.length*v;
};

/**
 *
 */
model.weather = null;

/**
 *
 */
model.weatherDays = 0;