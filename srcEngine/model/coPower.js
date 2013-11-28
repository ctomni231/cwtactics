//
//
controller.action_registerCommands("coPower_heal");

//
//
model.coPower_invokePower = function( pid, powerType ){
  assert( model.player_isValidPid(pid) );
  assert( powerType === model.co_POWER_LEVEL.COP || powerType === model.co_POWER_LEVEL.SCOP );

  // controller.scriptedValue( defender.owner, "firstCounter",0)
  var coData = model.co_data[pid];
  assert( coData.coA );

  var powerData = ( powerType === model.co_POWER_LEVEL.COP )? coData.coA.cop.power :
    coData.coA.scop.power ;

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // check all actions
  //

  // unit healing
  //
  if( powerData.healUnits ){
    controller.action_sharedInvoke(
      "coPower_heal",
      [ coData.scriptedValueByRules( powerData.healUnits, pid, "target",0)+
          model.player_RELATION_MODES.OWN, // 0 (NONE) --> 1 (OWN)
        coData.scriptedValueByRules( powerData.healUnits, pid, "amount",0) ]
    )
  }
};

// Heals units in relation to a player identical.
//
model.coPower_heal = function( pid, mode, amount ){
  assert( model.player_isValidPid(pid) );
  assert( mode >= model.player_RELATION_MODES.OWN && mode <= model.player_RELATION_MODES.ENEMY );
  assert( util.intRange(amount,1,10) );

  var steam = model.player_data[pid].team;
  var units = model.unit_data;
  for( var i = 0,e = units.length; i<e; i++ ){
    var unit = units[i];

    // check mode match
    var modeMatch = false;
    var team = model.player_data[unit.owner].team;
    if( unit.owner !== INACTIVE_ID ){
      switch( mode ){

        case model.player_RELATION_MODES.OWN :
          if( unit.owner === pid ) modeMatch = true;
          break;

        case model.player_RELATION_MODES.ALLIED :
          if( unit.owner !== pid && steam === team ) modeMatch = true;
          break;

        case model.player_RELATION_MODES.TEAM :
          if( unit.owner === pid && steam === team ) modeMatch = true;
          break;

        case model.player_RELATION_MODES.ENEMY :
          if( steam !== team ) modeMatch = true;
          break;
      }
    }

    // heal it when mode check was true
    if( modeMatch ) model.unit_heal(i,amount,false);
  }
};