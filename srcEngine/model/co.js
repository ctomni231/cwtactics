controller.registerInvokableCommand("deactivateCoPower");
controller.registerInvokableCommand("activateCoPower");
controller.registerInvokableCommand("activateSuperCoPower");
controller.registerInvokableCommand("modifyPowerLevel");

controller.defineEvent("modifyPowerLevel");
controller.defineEvent("activateSuperCoPower");
controller.defineEvent("activateCoPower");
controller.defineEvent("deactivateCoPower");
  
controller.defineGameConfig("coStarCost",5,50000,9000,5);
controller.defineGameConfig("coStarCostIncrease",0,50000,1800,5);
controller.defineGameConfig("coStarCostIncreaseSteps",0,50,10);

model.coData = util.list( constants.MAX_PLAYER, function( i ){ 
  return {
    power:      0,      // acc. co power
    timesUsed:  0,      // number of used co powers
    level:      0,      // active co power level
    coA:        null,   // main CO
    coB:        null    // sub CO
  };
});

// Define persitence handler
controller.persistenceHandler(
  
  // load
  function( dom ){
    var data = dom.co;
    
    // the length of a data set must be equal to the number
    // of maximum players
    if( constants.MAX_PLAYER !== data.length ) util.raiseError("");
    
    var source;
    var target;
    for( var i=0,e=constants.MAX_PLAYER; i<e; i++ ){
      target = model.coData[i];
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
  },
  
  // save
  function( dom ){
    
    // result document model for co data will be a matrix
    var data = [];
    var obj;
    
    for( var i=0,e=constants.MAX_PLAYER; i<e; i++ ){
      obj = model.coData[i];
      
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
  }
);

model.powerLevel = {
  INACTIVE: 0,
  COP:      1,
  SCOP:     2,
  TSCOP:    3
};

util.scoped(function(){
  
  function activatePower( pid, level, evName ){
    if( !model.isValidPlayerId(pid) ){
      model.criticalError(
        constants.error.ILLEGAL_PARAMETERS,
        constants.error.UNKNOWN_PLAYER_ID
      );
    }
    
    // Alter co data of the player
    var data = model.coData[pid];
    data.power = 0;
    data.level = level;
    data.timesUsed++;
    
    // Invoke model event
    var evCb = controller.events[evName];
    if( evCb ) evCb(pid);
  };
  
  // Deactivates the CO power of a player.
  // 
  // @param {Number} pid
  // 
  model.deactivateCoPower = function( pid ){
    activatePower( pid, model.powerLevel.INACTIVE,"deactivateCoPower");
  };
  
  // Activates the CO power of a player.
  // 
  // @param {Number} pid
  // 
  model.activateCoPower = function( pid ){
    activatePower( pid, model.powerLevel.COP, "activateCoPower" );
  };
  
  // Activates the super CO power of a player.
  // 
  // @param {Number} pid
  // 
  model.activateSuperCoPower = function( pid ){
    activatePower(pid, model.powerLevel.SCOP, "activateSuperCoPower");
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
  
  // Invoke model event
  var evCb = controller.events.modifyPowerLevel;
  if( evCb ) evCb(pid,value);
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