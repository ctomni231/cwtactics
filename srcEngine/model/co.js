model.coData = controller.persisted({
  
  object: util.list( constants.MAX_PLAYER, function( i ){ 
    return {
      power:      0, 
      timesUsed:  0,
      level:      0, 
      coA:        null, 
      coB:        null     
    };
  }),
  
  // #### Save the model from a document model here
  onsave: function( dom ){
    
    // result document model for co data will be a matrix
    var data = [];
    var obj;
    
    for( var i=0,e=constants.MAX_PLAYER; i<e; i++ ){
      obj = this[i];
      
      // persist the data as array
      // if target player isn't active then 
      // use a `0` as data
      if( model.players[i].team === constants.INACTIVE_ID ){
        data.push(0);
      }        
      else{
        data.push([
          obj.power,
          obj.timesUsed,
          obj.level,
          obj.coA, 
          obj.coB
        ]);
      }
    }
    
    dom.co = data;
  },
  
  // #### Load the model from a document model here
  onload: function( dom ){
    var data = dom.co;
    
    // the length of a data set must be equal to the number
    // of maximum players
    if( constants.MAX_PLAYER !== data.length ) util.raiseError("");
    
    var source;
    var target;
    for( var i=0,e=constants.MAX_PLAYER; i<e; i++ ){
      target = this[i];
      source = data[i];
      
      // read data from array back into the game model
      // if source is `0` then the data for this slot
      // is empty because the player is not active or
      // the document model is a map not a save
      if( source === 0 ){
        
        // TODO: use map configurations here
        target.power      = 0;
        target.timesUsed  = 0;
        target.level      = model.INACTIVE_POWER;
        target.coA        = null;
        target.coB        = null;
      }
      else{
        
        target.power = source[0];
        target.timesUsed = source[1];
        target.level = source[2];
        target.coA = source[3];
        target.coB = source[4];
      }
    }
  }
  
});

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
    var data = model.coData[pid];
    
    data.power = 0;
    data.level = level;
    data.timesUsed++;
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

// Modifies the power level of a player.
//  
// @param {Number} pid
// @param {Number} value 
model.modifyPowerLevel = function( pid, value ){
  var data = model.coData[pid];
  
  data.power += value;
  if( data.power < 0 ) data.power = 0;
};

// Returns the cost for one CO star for a given player.
//
// @param {type} pid id of the player
// @returns {Number} 
model.coStarCost = function( pid ){
  var cost = controller.configValue("coStarCost");
  var used = model.coData[pid].timesPowerUsed;
  
  // if usage counter is greater
  // than max usage counter then
  // use only the maximum increase
  // counter for calculation
  var maxUsed = controller.configValue("coStarCostIncreaseSteps");
  if( used > maxUsed ) used = maxUsed;
  
  cost += used*controller.configValue("coStarCostIncrease");
  
  return cost;
};