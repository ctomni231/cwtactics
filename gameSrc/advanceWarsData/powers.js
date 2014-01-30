// Dispatcher event when activate power gets invoked.
//
model.event_on("activatePower_invoked",function( pid, level ){
  assert( model.player_isValidPid(pid) );
  assert( level === model.co_POWER_LEVEL.COP || level === model.co_POWER_LEVEL.SCOP );
  
  var coData = model.co_data[pid];
  assert( coData.coA );

  var powerData = ( level === model.co_POWER_LEVEL.COP )? 
    coData.coA.cop.power : coData.coA.scop.power ;

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // check all actions
  //

  // unit healing
  //
  if( powerData.healUnits ){
    model.events.copower_healUnits(
      pid,
      controller.scriptedValueByRules( powerData.healUnits, pid, "target",0)+model.player_RELATION_MODES.OWN,
      controller.scriptedValueByRules( powerData.healUnits, pid, "amount",0)
    )
  }

  // unit damaging
  //
  if( powerData.damageUnits ){
    model.events.copower_damageUnits(
      pid,
      controller.scriptedValueByRules( powerData.damageUnits, pid, "target",0)+model.player_RELATION_MODES.OWN,
      controller.scriptedValueByRules( powerData.damageUnits, pid, "amount",0)
    )
  }

  // change Weather
  //
  else if( powerData.copower_changeWeather ){
    model.events.copower_healUnits(
      controller.scriptedValueByRules( powerData.healUnits, pid, "weather",0),
      controller.scriptedValueByRules( powerData.healUnits, pid, "days"   ,1)
    )
  }
});

// Healing units. Formally known and used by the CO ANDY (AW1-AW3).
//
model.event_on("copower_healUnits",function(pid,mode,amount){
  assert( model.player_isValidPid(pid) );
  assert( mode >= model.player_RELATION_MODES.OWN && mode <= model.player_RELATION_MODES.ENEMY );
  assert( util.intRange(amount,1,10) );

  var steam = model.player_data[pid].team;
  var units = model.unit_data;
  for( var i = 0,e = units.length; i<e; i++ ){
    var unit = units[i];
    if( unit.owner === INACTIVE_ID ) continue;
    
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
          
        default: assert(false)
      }
    }

    // heal it when mode check was true
    if( modeMatch ) model.events.healUnit(i,model.unit_convertPointsToHealth(amount),false);
  }
});

// Damaging units.
//
model.event_on("copower_damageUnits",function(pid,mode,amount){
  assert( model.player_isValidPid(pid) );
  assert( mode >= model.player_RELATION_MODES.OWN && mode <= model.player_RELATION_MODES.ENEMY );
  assert( util.intRange(amount,1,10) );

  var steam = model.player_data[pid].team;
  var units = model.unit_data;
  for( var i = 0,e = units.length; i<e; i++ ){
    var unit = units[i];
    if( unit.owner === INACTIVE_ID ) continue;
    
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
          
        default: assert(false)
      }
    }

    // heal it when mode check was true
    if( modeMatch ) model.events.damageUnit(i,model.unit_convertPointsToHealth(amount),false);
  }
});

// Change Weather. Formally known and used by the CO OLAF and DRAKE (AW1-AW3).
//
model.event_on("copower_changeWeather",function(weatherId,days){
  model.events.weather_change( model.data_nonDefaultWeatherTypes[weatherId] );
  model.events.dayEvent( days, "weather_calculateNext" );
});