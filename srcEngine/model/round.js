/**
 * Represents the current action day in the game. The day attribute increases
 * everytime if the first player starts its turn.
 * 
 * @type {Number}
 */
model.day = 0;

/**
 * Holds the identical number of the current turn owner.
 * 
 * @type {Number} 
 */
model.turnOwner = -1;

/**
 * 
 */
model.configRule = {};

/**
 * Returns true if the given player id is the current turn owner.
 *
 * @param pid player id
 */
model.isTurnOwner = function( pid ){
  return model.turnOwner === pid;
};

/**
 * Converts a number of days into turns.
 *
 * @param {Number} v number in days
 */
model.daysToTurns = function( v ){
  return model.players.length*v;
};

/**
 * Ends the turn for the current active turn owner.
 */
model.nextTurn = function(){
  var pid = model.turnOwner;
  var oid = pid;
  
  if( DEBUG ) util.log("player",pid,"ends it's turn");
  
  // FIND NEXT PLAYER
  pid++;
  while( pid !== oid ){

    if( pid === CWT_MAX_PLAYER ){
      pid = 0;
      
      // NEXT DAY
      model.day++;
      model.tickTimedEvents();

      var dayLimit = controller.configValue("dayLimit");
      if( dayLimit > 0 && model.day === dayLimit ){
        controller.endGameRound();
      }
    }

    if( model.players[pid].team !== CWT_INACTIVE_ID ){

      // FOUND NEXT PLAYER
      break;
    }

    // INCREASE ID
    pid++;
  }
  
  // SAME PLAYER ? -> CORRUPT GAME STATE
  if( pid === oid ) util.raiseError("could not find next player");
  
  // MISC ACTIONS
  model.drainFuel(pid);
  model.propertyFunds(pid);
  model.propertyRepairs(pid);
  model.propertySupply(pid);
  model.resetActableStatus(pid);
  if( controller.configValue("autoSupplyAtTurnStart") === 1 ) model.supplyUnitsBySupplierUnits(pid);

  model.recalculateFogMap( pid );
  
  if( DEBUG ) util.log("player",pid,"is new turn owner");
  model.turnOwner = pid;

  model.resetTurnTimer(); 
};