/**
 * Holds the identical numbers of all objects that can act during the turn.
 * After a unit has acted, it should be removed from this list with
 * {@link model.markUnitNonActable}.
 */
model.leftActors = util.list( 
  CWT_MAX_UNITS_PER_PLAYER, 
  false 
);

/**
 * Returns true if the selected uid can act in the current active turn,
 * else false.
 *
 * @param uid selected unit identical number
 */
model.canAct = function( uid ){
  var startIndex = model.turnOwner * CWT_MAX_UNITS_PER_PLAYER;

  if( uid >= startIndex + CWT_MAX_UNITS_PER_PLAYER || uid < startIndex ){
    return false;
  }
  else return model.leftActors[ uid - startIndex ] === true;
};

/**
 *
 * @param {Number} uid selected unit identical number
 * @param {Boolean} canAct the target status 
 */
model.setActableStatus = function( uid, canAct ){
  var startIndex = model.turnOwner * CWT_MAX_UNITS_PER_PLAYER;

  if( uid >= startIndex + CWT_MAX_UNITS_PER_PLAYER || uid < startIndex ){
    util.raiseError("unit with id",uid,"does not belongs to the turn owner");
  }
  else model.leftActors[ uid - startIndex ] = canAct;
};

/**
 *
 * @param {Number} pid
 */
model.resetActableStatus = function( pid ){
  var startIndex = model.turnOwner * CWT_MAX_UNITS_PER_PLAYER;
  for( var i=startIndex,e=i+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){
    model.leftActors[ i - startIndex ] = true;
  }
};

/**
 * @param {Number} uid
 */
model.markUnitActable = function( uid ){
  model.setActableStatus( uid, true );
};

/**
 * Called when an unit is trapped. Does not invoke any logic, useful for client listeners.
 * 
 * @param {Number} uid
 */
model.trapWait = function( uid ){};

/**
 * @param {Number} uid
 */
model.markUnitNonActable = function( uid ){
  model.setActableStatus( uid, false );
};