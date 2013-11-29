// commands
controller.action_registerCommands( "co_deactivateCOP" );
controller.action_registerCommands( "co_activateCOP" );
controller.action_registerCommands( "co_activateSCOP" );
controller.action_registerCommands( "co_modifyPowerLevel" );
controller.action_registerCommands( "co_detachCommander" );
controller.action_registerCommands( "co_attachCommander" );

// events
controller.event_define( "co_modifyPowerLevel" );
controller.event_define( "co_activateSCOP" );
controller.event_define( "co_activateCOP" );
controller.event_define( "co_deactivateCOP" );

// configs
controller.defineGameConfig( "co_getStarCost",              5, 50000, 9000, 5 );
controller.defineGameConfig( "co_getStarCostIncrease",      0, 50000, 1800, 5 );
controller.defineGameConfig( "co_getStarCostIncreaseSteps", 0, 50,    10 );

// Contains all co modes, that are available in `Custom Wars: Tactics`.
//
model.co_MODES = {
  NONE      :0,
  AW1       :1,
  AW2       :2,
  AWDS      :3,
  AWDR      :4
};

// Contains all co power levels.
//
model.co_POWER_LEVEL = {
  INACTIVE  : 0,
  COP       : 1,
  SCOP      : 2,
  TSCOP     : 3
};

// The current active co mode.
//
model.co_activeMode = model.co_MODES.AW1;

//
//
model.co_data = util.list( MAX_PLAYER, function( i ){
  return {
    power: 0, 				        // acc. co power
    timesUsed: 0, 		        // number of used co powers
    level: 0, 				        // active co power level
    coA: null, 				        // main CO
    coB: null,  			        // sub CO
    detachedTo: INACTIVE_ID  	// CO detached to a specific unit
  };
});

// Returns the range of a commander.
//
model.co_commanderRange = function( pid ){
  assert( util.intRange(pid,0,MAX_PLAYER-1) );
  assert( model.co_activeMode === model.co_MODES.AWDR );
  
  if( model.co_data[pid].detachedTo === INACTIVE_ID ) return -1;
  
  return -1; // TODO
};

// Returns `true` when an unit is in the range of a commander, else `false`.
//
model.co_isInCommanderFocus = function( uid, pid ){
  
  // are we playing Commander mode ?
  if( model.co_activeMode !== model.co_MODES.AWDR ) return false;
  
  // is commander active ?
  if( model.co_data[pid].detachedTo === INACTIVE_ID ) return false;
  
  var com   = model.units[model.co_data[pid].detachedTo];
  var cx    = com.x;
  var cy    = com.y;
  var cr    = model.co_commanderRange(pid);
  var unit  = model.units[uid];
  var x     = unit.x;
  var y     = unit.y;
  
  // check distance to commander
  var disX = Math.abs( x-cx );
  if( disX > cr ) return false;
  
  var disY = Math.abs( y-cy );
  if( disX+disY > cr ) return false;
  
  // in range of the commander
  return true;
};

// Activates a power of a player.
// 
model.co_activatePower_ = function( pid, level, evName ){
  if( DEBUG ) util.log("activate power level",level,"for player",pid);
  
  assert( model.player_isValidPid(pid) );
  
  // Alter co data of the player
  var data   = model.co_data[pid];
  data.power = 0;
  data.level = level;
  data.timesUsed++;
  
  // Invoke model event
  controller.events[evName]( pid );
};

// Deactivates the CO power of a player.
// 
model.co_deactivateCOP = function( pid ){
  model.co_activatePower_( pid, model.co_POWER_LEVEL.INACTIVE, "co_deactivateCOP" );
};

// Activates the CO power of a player.
// 
model.co_activateCOP = function( pid ){
  model.co_activatePower_( pid, model.co_POWER_LEVEL.COP, "co_activateCOP" );
};

// Activates the super CO power of a player.
// 
model.co_activateSCOP = function( pid ){
  model.co_activatePower_( pid, model.co_POWER_LEVEL.SCOP, "co_activateSCOP" );
};

// Modifies the power level of a player.
//  
model.co_modifyPowerLevel = function( pid, value ){
  assert( model.player_isValidPid(pid) );
  
  var data = model.co_data[pid];
  
  data.power += value;
  if( data.power < 0 ) data.power = 0;
  
  // Invoke model event
  controller.events.co_modifyPowerLevel( pid, value );
};

// Returns `true`when a given player can activate a power level.
//
model.co_canActivatePower = function( pid, powerType ){
  assert( model.player_isValidPid(pid) );
  assert( util.intRange(powerType,model.co_POWER_LEVEL.INACTIVE,model.co_POWER_LEVEL.TSCOP) );
  
  var co_data = model.co_data[ model.round_turnOwner ];
  
  // co must be available and current power must be inactive
  if( co_data.coA === null ) return false;
  if( co_data.level !== model.co_POWER_LEVEL.INACTIVE ) return false;
  
  var stars;
  switch( powerType ){
      
    case model.co_POWER_LEVEL.COP: 
      stars = co_data.coA.coStars;
      break;
      
    case model.co_POWER_LEVEL.SCOP:
      stars = co_data.coA.scoStars;
      break;
      
      // TODO
  };
  
  return ( co_data.power >= model.co_getStarCost(model.round_turnOwner) * stars );
};

// Returns the cost for one CO star for a given player.
//
model.co_getStarCost = function( pid ){
  assert( model.player_isValidPid(pid) );
  
  var cost = controller.configValue( "co_getStarCost" );
  var used = model.co_data[pid].timesPowerUsed;
  
  // if usage counter is greater than max usage counter then use 
  // only the maximum increase counter for calculation
  var maxUsed = controller.configValue( "co_getStarCostIncreaseSteps" );
  if( used > maxUsed ) used = maxUsed;
  
  cost += used * controller.configValue( "co_getStarCostIncrease" );
  
  return cost;
};

// Sets the main CO of a player.
//
model.co_setMainCo = function( pid, type ){
  assert( model.player_isValidPid(pid) );
  
  if( type === null ) model.co_data[pid].coA = null;
  else {
    assert( model.data_coSheets.hasOwnProperty(type) );
    model.co_data[pid].coA = model.data_coSheets[type];
  }
};

// Sets the side CO of a player.
//
model.co_setSideCo = function( pid, type ){
  assert( model.player_isValidPid(pid) );
  assert( model.data_coSheets.hasOwnProperty(type) );
  
  if( type === null ) model.co_data[pid].coB = null;
  else {
    assert( model.data_coSheets.hasOwnProperty(type) );
    model.co_data[pid].coB = model.data_coSheets[type];
  }
};

// Detaches a commander from a given unit back to the player pool.
//
model.co_detachCommander = function( pid, uid ){
  assert( model.player_isValidPid(pid) );
  assert( model.unit_isValidUnitId(uid) );
  assert( model.unit_data[uid].owner !== INACTIVE_ID );
  
  // co must detached to the unit
  assert( model.co_data[pid].detachedTo !== uid );
  
  model.co_data[pid].detachedTo = INACTIVE_ID;
};

// Attaches a commander from a player pool to a given unit.
//
model.co_attachCommander = function( pid, uid ){
  assert( model.player_isValidPid(pid) );
  assert( model.unit_isValidUnitId(uid) );
  assert( model.unit_data[uid].owner !== INACTIVE_ID );
  
  // co cannot be detached to anything
  assert( model.co_data[pid].detachedTo === INACTIVE_ID );
  
  model.co_data[pid].detachedTo = uid;
};
