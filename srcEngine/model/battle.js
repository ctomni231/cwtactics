// commands
controller.action_registerCommands("battle_invokeBattle");
controller.action_registerCommands("battle_attackProperty");

// events
controller.event_define("battle_invokeBattle");
controller.event_define("battle_mainAttack");
controller.event_define("battle_counterAttack");
controller.event_define("battle_propertyDestroyed");
controller.event_define("battle_attackProperty");

// config
controller.defineGameConfig("daysOfPeace",0,50,0);

// scriptable
controller.defineGameScriptable("minrange",1,MAX_SELECTION_RANGE-1);
controller.defineGameScriptable("maxrange",1,MAX_SELECTION_RANGE);
controller.defineGameScriptable("att",50,400);
controller.defineGameScriptable("def",50,400);
controller.defineGameScriptable("counteratt",50,400);
controller.defineGameScriptable("luck",-50,50);
controller.defineGameScriptable("firstCounter",0,1);
// controller.defineGameScriptable("comtowerbonus",1,100);
controller.defineGameScriptable("terrainDefense",0,12);
controller.defineGameScriptable("terrainDefenseModifier",10,300);

// Returns `true` when the game is in the peace phase.
//
model.battle_isPeacePhaseActive = function(){
  return ( model.round_day < controller.configValue("daysOfPeace") );
};

// Different possible unit battle types.
//
model.battle_FIRETYPES = {
  DIRECT:0,
  INDIRECT:1,
  BALLISTIC:2,
  NONE:3
};

// String keys for the two weapon types.
//
model.battle_WEAPON_KEYS = ["main_wp","sec_wp"];

// Calculates the targets of a battle unit. If `data` is given, then the attack targets will be
// marked in this object.
//
model.battle_calculateTargets = function( uid, x, y, data, markAttackableTiles ){  
  var markInData = (typeof data !== "undefined");
  if(!markAttackableTiles) markAttackableTiles = false;
  
  assert( model.unit_isValidUnitId(uid) );

  var unit        = model.unit_data[uid];
  var teamId      = model.player_data[unit.owner].team;
  var attackSheet = unit.type.attack;
  
  if( arguments.length === 1 ){
    x = unit.x;
    y = unit.y; 
  }
  
  if( DEBUG ) util.log("calculate targets for unit id",uid,"at",x,",",y );
  
  assert( model.map_isValidPosition(x,y) );
  if( arguments.length === 3 ) assert( util.isBoolean(markAttackableTiles) );
  
  // NO BATTLE UNIT ?
  if( typeof attackSheet === "undefined" ) return false;
  
  // ONLY MAIN WEAPON WITHOUT AMMO ? 
  if( model.battle_hasMainWeapon(unit.type) && !model.battle_hasSecondaryWeapon(unit.type) &&
     unit.type.ammo > 0 && unit.ammo === 0    ) return false;
  
  var minR = 1;
  var maxR = 1;
  
  if( unit.type.attack.minrange ){
    
    controller.prepareTags( x,y, uid );
    minR = controller.scriptedValue( unit.owner, "minrange", unit.type.attack.minrange );
    maxR = controller.scriptedValue( unit.owner, "maxrange", unit.type.attack.maxrange );
  }
  
  var lX;
  var hX;
  var lY = y-maxR;
  var hY = y+maxR;
  if( lY < 0 ) lY = 0;
  if( hY >= model.map_height ) hY = model.map_height-1;
  for( ; lY<=hY; lY++ ){
    
    var disY = Math.abs( lY-y );
    lX = x-maxR+disY;
    hX = x+maxR-disY;
    if( lX < 0 ) lX = 0;
    if( hX >= model.map_width ) hX = model.map_width-1;
    for( ; lX<=hX; lX++ ){
      
      if( markAttackableTiles ){
        if( model.map_getDistance( x,y, lX,lY ) >= minR ){
          
          // SYMBOLIC YES YOU CAN ATTACK THIS TILE
          data.setValueAt(lX,lY, 1 ); 
        }
      }
      else{
        
        // IN FOG ?
        if( model.fog_turnOwnerData[lX][lY] === 0 ) continue;
        
        if( model.map_getDistance( x,y, lX,lY ) >= minR ){
          
          var dmg = -1;
          
          // ONLY UNIT FROM OTHER TEAMS ARE ATTACKABLE
          var tUnit = model.unit_posData[ lX ][ lY ];
          if( tUnit !== null && model.player_data[ tUnit.owner ].team !== teamId ){
            dmg = model.battle_getBaseDamageAgainst(unit,tUnit);
            if( dmg > 0 ){
              
              // IF DATA MODE IS ON, THEN MARK THE POSITION
              // ELSE RETURN TRUE
              if( markInData ) data.setValueAt(lX,lY, dmg );
              else return true;
            }
          }
          
        }
      }
    }
  }
  
  return false;
};

//  Returns true if the unit type has a main weapon else false.
//
model.battle_hasMainWeapon = function( type ){
  var attack = type.attack;
  return typeof attack !== "undefined" && typeof attack.main_wp !== "undefined";
};

//  Returns true if the unit type has a secondary weapon else false.
//  
model.battle_hasSecondaryWeapon = function( type ){
  var attack = type.attack;
  return typeof attack !== "undefined" && typeof attack.sec_wp !== "undefined";
};

// Returns the firetype (`model.battle_FIRETYPES`) of a unit type.
//
model.battle_getUnitFireType = function( type ){
  if( !model.battle_hasMainWeapon( type ) && !model.battle_hasSecondaryWeapon( type ) ){
    return model.battle_FIRETYPES.NONE;
  }
  
  // main weapon decides fire type
  if( typeof type.attack.minrange !== "undefined" ){
    var min = type.attack.minrange;
    
    // min range of 1 means ballistic weapon
    return ( min === 1 )? model.battle_FIRETYPES.BALLISTIC : 
    model.battle_FIRETYPES.INDIRECT;
  }
  else return model.battle_FIRETYPES.DIRECT;
};

// Returns `true` if a given unit is an indirect firing unit ( *e.g. artillery* ) else `false`. 
// 
model.battle_isIndirectUnit = function( uid ){
  assert( model.unit_isValidUnitId(uid) );

  return model.battle_getUnitFireType(model.unit_data[uid].type) === 
    model.battle_FIRETYPES.INDIRECT;
};

// Returns `true` if a given unit is an ballistic firing unit ( *e.g. anti-tank-gun* ) else 
// `false`. 
// 
model.battle_isBallisticUnit = function( uid ){
  assert( model.unit_isValidUnitId(uid) );

  return model.battle_getUnitFireType(model.unit_data[uid].type) === 
    model.battle_FIRETYPES.BALLISTIC;
};

//  Returns true if an attacker can use it's main weapon against a defender. The distance won't be
//  checked in case of indirect units.
//
model.battle_canUseMainWeapon = function( attacker, defender ){
  var attack  = attacker.type.attack;
  var tType   = defender.type.ID;
  var v;
  
  // check ammo and main weapon availability against the defender type
  if( attacker.ammo > 0 && attack.main_wp !== undefined ){
    v = attack.main_wp[tType];
    if( typeof v !== "undefined" ) return true;
  }
  
  return false;
};

//  Returns true if an unit has targets in sight, else false.
//
model.battle_hasTargets = function( uid,x,y ){
  return model.battle_calculateTargets(uid,x,y);
};

//  Returns the base damage of an attacker against a defender. If the attacker cannot attack
//  the defender then -1 will be returned. This function recognizes the ammo usage of main weapons.
//  If the attacker cannot attack with his main weapon due low ammo then only the secondary weapon 
//  will be checked. 
//
model.battle_getBaseDamageAgainst = function( attacker, defender, withMainWp ){
  var attack  = attacker.type.attack;
  var tType   = defender.type.ID;
  var v;
  
  if( typeof withMainWp === "undefined" ) withMainWp = true;
  
  // check main weapon
  if( withMainWp && attacker.ammo > 0 && attack.main_wp !== undefined ){
    v = attack.main_wp[tType];
    if( typeof v !== "undefined" ) return v;
  }
  
  // check secondary weapon
  if( attack.sec_wp !== undefined ){ 
    v = attack.sec_wp[tType];
    if( typeof v !== "undefined" ) return v;
  }
  
  return -1;
};

//  Returns the battle damage against an other unit.
//
model.battle_getBattleDamageAgainst = function( attacker, defender, luck, withMainWp, isCounter ){
  if( DEBUG ) util.log(
    "calculating battle damage",
    model.unit_extractId(attacker),
    "against",
    model.unit_extractId(attacker) 
  );
  
  assert( util.intRange(luck,0,100) );
  assert( util.isBoolean(withMainWp) );
  assert( util.isBoolean(isCounter) );
  
  var BASE  = model.battle_getBaseDamageAgainst(attacker,defender,withMainWp);
  if( BASE === -1 ) return -1;

  var AHP   = model.unit_convertHealthToPoints( attacker );
  var DHP   = model.unit_convertHealthToPoints( defender );
  
  // attacker values
  controller.prepareTags( attacker.x, attacker.y );
  var LUCK = parseInt( (luck/100)*controller.scriptedValue(attacker.owner,"luck",10), 10 );
  var ACO  = controller.scriptedValue( attacker.owner, "att", 100 );
  if( isCounter ) ACO += controller.scriptedValue( defender.owner, "counteratt", 0 );
  
  // defender values
  controller.prepareTags( defender.x, defender.y );
  var DCO = controller.scriptedValue( defender.owner, "def", 100 );

  var def = model.map_data[defender.x][defender.y].defense;
  var DTR = parseInt(
    controller.scriptedValue( defender.owner, "terrainDefense",def)*
    controller.scriptedValue( defender.owner, "terrainDefenseModifier",100)/
    100,
    10
  );
  
  // **Formular:** `D%=[B*ACO/100+R]*(AHP/10)*[(200-(DCO+DTR*DHP))/100]`
  var damage = (BASE*ACO/100+LUCK) * (AHP/10) * ( (200-( DCO+(DTR*DHP) ) ) /100 );
  damage = parseInt( damage, 10 );
  
  if( DEBUG ){
    util.log(
      "results [",
      BASE,
      "*",
      ACO,
      "/100+",
      LUCK,
      "]*(",
      AHP,
      "/10)*[(200-(",
      DCO,
      "+",
      DTR,
      "*",
      DHP,
      "))/100] =",
      damage
    );
  }
  
  return damage;
};

//  local helper to search a surrounding tile that isn't occupied by an unit
//  and has a distance of to between itself and the tile at pos (ax,ay)
//   
model.battle_searchTile_ = function( rx,ry, ax,ay ){
  var x=-1,y=-1;
  
  // direct neighbors (distance 1)
  if( model.map_isValidPosition(rx-1,ry) && !model.unit_posData[rx-1][ry] ){ x=rx-1; y=ry; }
  if( model.map_isValidPosition(rx,ry-1) && !model.unit_posData[rx][ry-1] ){ x=rx; y=ry-1; }
  if( model.map_isValidPosition(rx,ry+1) && !model.unit_posData[rx][ry+1] ){ x=rx; y=ry+1; }
  if( model.map_isValidPosition(rx+1,ry) && !model.unit_posData[rx+1][ry] ){ x=rx+1; y=ry; }
  
  // direct neighbors (distance 2) 
  if( model.map_isValidPosition(rx-1,ry-1) && !model.unit_posData[rx-1][ry-1] ){ x=rx-1; y=ry-1; }
  if( model.map_isValidPosition(rx-1,ry+1) && !model.unit_posData[rx-1][ry+1] ){ x=rx-1; y=ry+1; }
  if( model.map_isValidPosition(rx+1,ry-1) && !model.unit_posData[rx+1][ry-1] ){ x=rx+1; y=ry-1; }
  if( model.map_isValidPosition(rx+1,ry+1) && !model.unit_posData[rx+1][ry+1] ){ x=rx+1; y=ry+1; }
  
  if( x !== -1 ){
    
  }
};

model.battle_attackProperty = function( attId, propId ){
  assert( model.unit_isValidUnitId(attId) );
  assert( model.property_isValidPropId(propId) );

  var attacker  = model.unit_data[attId];
  var defender  = model.property_data[propId];
  var aSheets   = attacker.type;
  var dmg       = model.battle_getBaseDamageAgainst(attacker,defender,true);
  
  controller.events.battle_attackProperty( attId, propId );
  
  // decrease prop hp
  if( defender.capturePoints >= 0 ){ /* ERROR */ }
  else{
    
    defender.capturePoints += dmg;
    if( defender.capturePoints >= 0 ){
      
      // change property type from battle property to a non-battle type property (e.g. ruins)
      model.property_changeType( propId, defender.type.destroyedType );
      defender.capturePoints = 0;
      
      controller.events.battle_propertyDestroyed( propId );
    }
  }
};

// Invokes a battle between two units. If the defender is a direct attacking unit then
// the defender tries to counter attack if he is in range.
//
model.battle_invokeBattle = function( attId, defId, attLuckRatio, defLuckRatio ){
  if( DEBUG ) util.log(
    "start battle between",
    attId,
    "luck(",
    attLuckRatio,
    ") and",
    defId,
    "luck(",
    defLuckRatio,
    ")"
  );
  
  assert( model.unit_isValidUnitId(attId) );
  assert( util.intRange(attLuckRatio,0,100) );
  assert( model.unit_isValidUnitId(defId) );
  assert( util.intRange(defLuckRatio,0,100) );
  
  var attacker        = model.unit_data[attId];
  var defender        = model.unit_data[defId];
  var indirectAttack  = model.battle_isIndirectUnit(attId);

  // **check firstCounter:** if first counter is active then the defender
  // attacks first. In this case swap attacker and defender.
  if( !indirectAttack && controller.scriptedValue( defender.owner, "firstCounter",0) === 1 ){
    if( !model.battle_isIndirectUnit(defId) ){
      var tmp_ = defender;
      defender = attacker;
      attacker = tmp_;
    }
  }

  var aSheets         = attacker.type;
  var dSheets         = defender.type;
  var attOwner        = attacker.owner;
  var defOwner        = defender.owner;
  var powerAtt        = model.unit_convertHealthToPoints( defender );
  var powerCounterAtt = model.unit_convertHealthToPoints( attacker );
  var damage;
  var retreatVal      = powerAtt;
  
  // invoke introduction event
  controller.events.battle_invokeBattle( attId, defId, damage );
  
  // main attack
  var mainWpAttack = model.battle_canUseMainWeapon(attacker,defender);
  damage = model.battle_getBattleDamageAgainst(attacker,defender,attLuckRatio);

  if( damage !== -1 ){
    model.unit_inflictDamage( defId, damage );

    // invoke main attack event
    controller.events.battle_mainAttack( attId, defId, damage, mainWpAttack );

    powerAtt -= model.unit_convertHealthToPoints( defender );

    if( mainWpAttack ) attacker.ammo--;

    powerAtt        = ( parseInt(        powerAtt*0.1*dSheets.cost, 10 ) );
    model.co_modifyPowerLevel( attOwner, parseInt( 0.5*powerAtt, 10 ) );
    model.co_modifyPowerLevel( defOwner, powerAtt );

    retreatVal = model.unit_convertHealthToPoints( defender )/retreatVal*100;
    if( retreatVal < 20 ){

      // retreat into a neighbor tile if possible
      retreatVal = model.battle_searchTile_( defender.x,defender.y, attacker.x,attacker.y );
    }
    else retreatVal = false;
  }
  
  // counter attack when defender survives and defender is an indirect
  // attacking unit
  if( retreatVal && defender.hp > 0 && !model.battle_isIndirectUnit(defId) ){
    mainWpAttack = model.battle_canUseMainWeapon(defender,attacker);

    damage = model.battle_getBattleDamageAgainst( 
      defender,attacker,
      defLuckRatio, 
      mainWpAttack, 
      true 
    );

    if( damage !== -1 ){
      model.unit_inflictDamage( attId, damage );

      // invoke counter event
      controller.events.battle_counterAttack( defId, attId, damage, mainWpAttack );

      powerCounterAtt -= model.unit_convertHealthToPoints( attacker );

      if( mainWpAttack ) defender.ammo--;

      powerCounterAtt = ( parseInt( powerCounterAtt*0.1*aSheets.cost, 10 ) );
      model.co_modifyPowerLevel( defOwner, parseInt( 0.5*powerCounterAtt, 10 ) );
      model.co_modifyPowerLevel( attOwner, powerCounterAtt );
    }
  }
  
};