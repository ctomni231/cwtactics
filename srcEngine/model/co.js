/**
 * Indicates a non active power level of a CO.
 * 
 * @constant
 * @type Number
 */
model.INACTIVE_POWER = 0;

/**
 * Indicates an active normal power level of a CO.
 * 
 * @constant
 * @type Number
 */
model.CO_POWER = 1;

/**
 * Indicates an active super power level of a CO.
 * 
 * @constant
 * @type Number
 */
model.SUPER_CO_POWER = 2;

/**
 * Indicates an active tag power level of a CO.
 * 
 * @constant
 * @type Number
 */
model.TAG_CO_POWER = 3;

util.scoped(function(){
  
  function activatePower( pid, level ){
    var player = model.players[pid];
    
    player.coPower_active = level;
    player.power = 0;
    
    // INCREASE USAGE COUNTER
    player.timesPowerUsed++;
  };

  /**
   * Deactivates the CO power of a player.
   * 
   * @param {Number} pid
   */
  model.activateCoPower = function( pid ){
    activatePower(pid,model.INACTIVE_POWER);
  };


  /**
   * Activates the CO power of a player.
   * 
   * @param {Number} pid
   */
  model.activateCoPower = function( pid ){
    activatePower(pid,model.CO_POWER);
  };

  /**
   * Activates the super CO power of a player.
   * 
   * @param {Number} pid
   */
  model.activateSuperCoPower = function( pid ){
    activatePower(pid,model.SUPER_CO_POWER);
  };
  
});

/**
 * Modifies the power level of a player.
 * 
 * @param {Number} pid
 * @param {Number} value
 */
model.modifyPowerLevel = function( pid, value ){
  model.players[pid].power += value;
  if( model.players[pid].power < 0 ) model.players[pid].power = 0;
};

/**
 * Returns the cost for one CO star for a given player.
 * 
 * @param {type} pid id of the player
 * @returns {Number}
 */
model.coStarCost = function( pid ){
  var cost = controller.configValue("coStarCost");
  var used = model.players[pid].timesPowerUsed;
  
  // IF USAGE COUNTER IS GREATER THAN MAX USAGE COUNTER THEN USE ONLY THE MAXIMUM INCREASE COUNTER FOR CALCULATION
  var maxUsed = controller.configValue("coStarCostIncreaseSteps");
  if( used > maxUsed ) used = maxUsed;
  
  cost += used*controller.configValue("coStarCostIncrease");
  
  return cost;
};