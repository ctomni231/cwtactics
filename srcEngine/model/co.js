controller.defineGameConfig( "co_getStarCost",              5, 50000, 9000, 5 );
controller.defineGameConfig( "co_getStarCostIncrease",      0, 50000, 1800, 5 );
controller.defineGameConfig( "co_getStarCostIncreaseSteps", 0, 50,    10 );
controller.defineGameConfig( "co_enabledCoPower",           0, 1,     1 );

// Contains all co modes, that are available in `Custom Wars: Tactics`.
//
model.co_MODES = {
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
    power: 0,                             // acc. co power
    timesUsed: 0,                         // number of used co powers
    level: model.co_POWER_LEVEL.INACTIVE, // active co power level
    coA: null,                            // main CO
    coB: null,                            // sub CO
    detachedTo: INACTIVE_ID               // CO detached to a specific unit
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
  var used = model.co_data[pid].timesUsed;

  // if usage counter is greater than max usage counter then use
  // only the maximum increase counter for calculation
  var maxUsed = controller.configValue( "co_getStarCostIncreaseSteps" );
  if( used > maxUsed ) used = maxUsed;

  cost += used * controller.configValue( "co_getStarCostIncrease" );

  return cost;
};
