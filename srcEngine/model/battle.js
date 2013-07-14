// # Battle Module
//
// Provides several functions to do battles between different 
// battle units.

// ### Meta Data

controller.registerInvokableCommand("battleBetween");

controller.defineEvent("battleBetween");
controller.defineEvent("mainAttack");
controller.defineEvent("counterAttack");

controller.defineGameConfig("daysOfPeace",0,50,0);
    
controller.defineGameScriptable("minrange",1,constants.MAX_SELECTION_RANGE-1);
controller.defineGameScriptable("maxrange",1,constants.MAX_SELECTION_RANGE);
controller.defineGameScriptable("att",50,400);
controller.defineGameScriptable("def",50,400);
controller.defineGameScriptable("counteratt",50,400);
controller.defineGameScriptable("luck",-50,50);
controller.defineGameScriptable("firstcounter",0,1);
controller.defineGameScriptable("comtowerbonus",1,100);
controller.defineGameScriptable("terraindefense",0,12);
controller.defineGameScriptable("terraindefensemodifier",10,300);

// Units can have an attack ability to attack other units
// Several parsing stuff for unit types will be registered here
model.unitTypeParser.addHandler(function(sheet){
    var keys,key,i1,i2,e1,e2,list;
    
    if( !util.expectNumber(sheet,"ammo",true,true,0,9) ) return false;
    
    if( expectObject(sheet,"attack",false) === util.expectMode.DEFINED ){
      att = sheet.attack;
      
      // check range rules if range is given
      if( !util.expectNumber(att,"minrange",false,true,1) ) return false;
      if( !util.expectNumber(att,"maxrange",false,true,att.minrange+1) ) return false;
      
      // check attack values
      for( i1=0,e1=model.wpKeys_.length; i1<e2; i1++ ){
        if( expectObject(att,model.wpKeys_[i1],false) ){
          list = att[model.wpKeys_[i1]];
          keys = Object.keys(list);
          for( i2=0,e2=keys.length; i2<e2; i2++ ){
              
            key = keys[i2];
            if( !util.expectNumber( list, key, true, true, 1 ) ) return false;
          }
        }
      }
    }
});

model.tileTypeParser.addHandler(function(sheet){
  if(!util.expectNumber(sheet, "defense", true, true, 0, 6))return false;
});

// ---

// ### Logic

model.wpKeys_ = ["main_wp","sec_wp"];

model.attackRangeMod_ = function( uid, x, y, data, markAttackableTiles ){
  var markInData = (typeof data !== "undefined");
  if(!markAttackableTiles) markAttackableTiles = false;
  
  var unit = model.units[uid];
  var teamId = model.players[unit.owner].team;
  var attackSheet = unit.type.attack;
  if( arguments.length === 1 ){
    x = unit.x;
    y = unit.y; 
  }
  
  // NO BATTLE UNIT ?
  if( typeof attackSheet === "undefined" ) return false;
  
  // ONLY MAIN WEAPON WITHOUT AMMO ? 
  if( model.hasMainWeapon(unit.type) && !model.hasSecondaryWeapon(unit.type) &&
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
  if( hY >= model.mapHeight ) hY = model.mapHeight-1;
  for( ; lY<=hY; lY++ ){
    
    var disY = Math.abs( lY-y );
    lX = x-maxR+disY;
    hX = x+maxR-disY;
    if( lX < 0 ) lX = 0;
    if( hX >= model.mapWidth ) hX = model.mapWidth-1;
    for( ; lX<=hX; lX++ ){
      
      if( markAttackableTiles ){
        if( model.distance( x,y, lX,lY ) >= minR ){
          
          // SYMBOLIC YES YOU CAN ATTACK THIS TILE
          data.setValueAt(lX,lY, 1 ); 
        }
      }
      else{
        
        // IN FOG ?
        if( model.fogData[lX][lY] === 0 ) continue;
        
        if( model.distance( x,y, lX,lY ) >= minR ){
          
          // ONLY UNIT FROM OTHER TEAMS ARE ATTACKABLE
          var tUnit = model.unitPosMap[ lX ][ lY ];
          if( tUnit !== null && model.players[ tUnit.owner ].team !== teamId ){
            
            var dmg = model.baseDamageAgainst(unit,tUnit);
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
//  @param {UnitSheet} type
//
model.hasMainWeapon = function( type ){
  var attack = type.attack;
  return typeof attack !== "undefined" && typeof attack.main_wp !== "undefined";
};

//  Returns true if the unit type has a secondary weapon else false.
//  
//  @param {UnitSheet} type
//
model.hasSecondaryWeapon = function( type ){
  var attack = type.attack;
  return typeof attack !== "undefined" && typeof attack.sec_wp !== "undefined";
};

model.getUnitFireType = function( type ){
  if( !model.hasMainWeapon( type ) ) return model.unitFiretype.NONE;
  
  // main weapon decides fire type
  if( typeof tp.minrange === "number" ){
    var min = type.minrange;
    
    // min range of 1 means ballistic weapon
    return ( min === 1 )? model.unitFiretype.BALLISTIC : 
                          model.unitFiretype.INDIRECT;
  }
  else return model.unitFiretype.DIRECT;
};

//  Returns true if a given unit is an indirect firing unit (e.g. artillery) else false. 
// 
//  @param {type} uid id of the unit
//
model.isIndirectUnit = function( uid ){
  return model.getUnitFireType(model.units[uid].type) === model.unitFiretype.INDIRECT;
};

model.isBallisticUnit = function( uid ){
  return model.getUnitFireType(model.units[uid].type) === model.unitFiretype.BALLISTIC;
};

//  Returns true if an attacker can use it's main weapon against a defender. The distance won't be
//  checked in case of indirect units.
//
model.canUseMainWeapon = function( attacker, defender ){
  var attack = attacker.type.attack;
  var tType = defender.type.ID;
  var v;
  
  // check ammo and main weapon availability against the defender type
  if( attacker.ammo > 0 && attack.main_wp !== undefined ){
    v = attack.main_wp[tType];
    if( typeof v === "number" ) return true;
  }
  
  return false;
};

//  Returns true if an unit has targets in sight, else false.
//  
//  @param {type} uid id of the unit
//  @param {Number} x (default: unit position)
//  @param {Number} y (default: unit position)
//
model.hasTargets = function( uid,x,y ){
  return model.attackRangeMod_(uid,x,y);
};

//  Returns the base damage of an attacker against a defender. If the attacker cannot attack
//  the defender then -1 will be returned. This function recognizes the ammo usage of main weapons.
//  If the attacker cannot attack with his main weapon due low ammo then only the secondary weapon 
//  will be checked. 
//
model.baseDamageAgainst = function( attacker, defender, withMainWp ){
  var attack = attacker.type.attack;
  var tType = defender.type.ID;
  var v;
  
  if( typeof withMainWp === "undefined" ) withMainWp = true;
  
  // check main weapon
  if( withMainWp && attacker.ammo > 0 && attack.main_wp !== undefined ){
    v = attack.main_wp[tType];
    if( typeof v === "number" ) return v;
  }
  
  // check secondary weapon
  if( attack.sec_wp !== undefined ){ 
    v = attack.sec_wp[tType];
    if( typeof v === "number" ) return v;
  }
  
  return -1;
};

//  Returns the battle damage against an other unit.
//
model.battleDamageAgainst = function( attacker, defender, luck, withMainWp, isCounter ){
  var BASE = model.baseDamageAgainst(attacker,defender,withMainWp);
  
  var AHP  = model.unitHpPt( attacker );
  var DHP = model.unitHpPt( defender );
  
  // ATTACKER VALUES
  controller.prepareTags( attacker.x, attacker.y );
  var LUCK = parseInt( (luck/100)*controller.scriptedValue(attacker.owner,"luck",10), 10 );
  var ACO  = controller.scriptedValue( attacker.owner, "att", 100 );
  if( isCounter ) ACO += controller.scriptedValue( defender.owner, "counteratt", 0 );
  
  // DEFENDER VALUES
  controller.prepareTags( defender.x, defender.y );
  var DCO  = controller.scriptedValue( defender.owner, "def", 100 );
  var DTR = controller.scriptedValue( defender.owner, "terraindefense", model.map[defender.x][defender.y].defense );
  
  // D%=[B*ACO/100+R]*(AHP/10)*[(200-(DCO+DTR*DHP))/100]
  var damage = (BASE*ACO/100+LUCK) * (AHP/10) * ( (200-( DCO+(DTR*DHP) ) ) /100 );
  damage = parseInt( damage, 10 );
  
  if( DEBUG ){
    util.log(
      "attacker:",model.extractUnitId( attacker ),
      "[",BASE,"*",ACO,"/100+",LUCK,"]*(",AHP,"/10)*[(200-(",DCO,"+",DTR,"*",DHP,"))/100]",
      "=",damage
    );
  }
  
  return damage;
};

util.scoped(function(){
  
  //  local helper to search a surrounding tile that isn't occupied by an unit
  //  and has a distance of to between itself and the tile at pos (ax,ay)
  //    
  //  @param {Number} rx
  //  @param {Number} ry
  //  @param {Number} ax
  //  @param {Number} ay
  //
  function searchTile( rx,ry, ax,ay ){
    var x=-1,y=-1;
    
    // direct neighbors (distance 1)
    if( model.isValidPosition(rx-1,ry) && !model.unitPosMap[rx-1][ry] ){ x=rx-1; y=ry; }
    if( model.isValidPosition(rx,ry-1) && !model.unitPosMap[rx][ry-1] ){ x=rx; y=ry-1; }
    if( model.isValidPosition(rx,ry+1) && !model.unitPosMap[rx][ry+1] ){ x=rx; y=ry+1; }
    if( model.isValidPosition(rx+1,ry) && !model.unitPosMap[rx+1][ry] ){ x=rx+1; y=ry; }
    
    // direct neighbors (distance 2) 
    if( model.isValidPosition(rx-1,ry-1) && !model.unitPosMap[rx-1][ry-1] ){ x=rx-1; y=ry-1; }
    if( model.isValidPosition(rx-1,ry+1) && !model.unitPosMap[rx-1][ry+1] ){ x=rx-1; y=ry+1; }
    if( model.isValidPosition(rx+1,ry-1) && !model.unitPosMap[rx+1][ry-1] ){ x=rx+1; y=ry-1; }
    if( model.isValidPosition(rx+1,ry+1) && !model.unitPosMap[rx+1][ry+1] ){ x=rx+1; y=ry+1; }
    
    if( x !== -1 ){
      
    }
  }
  
  // Invokes a battle between two units. If the defender is a direct attacking unit then
  // the defender tries to counter attack if he is in range.
  //
  //  @param {type} attId id of the attacker
  //  @param {type} defId id of the defender
  //  @param {type} attLuckRatio luck of the attacker (0-100)
  //  @param {type} defLuckRatio luck of the defender (0-100)
  //
  model.battleBetween = function( attId, defId, attLuckRatio, defLuckRatio ){
    var attacker = model.units[attId];
    var defender = model.units[defId];
    var aSheets = attacker.type;
    var dSheets = defender.type;
    var attOwner = attacker.owner;
    var defOwner = defender.owner;
    var powerAtt        = model.unitHpPt( defender );
    var powerCounterAtt = model.unitHpPt( attacker );
    var evCb,damage;
    var retreatVal = powerAtt;
    
    // invoke introduction event
    evCb = controller.events.battleBetween;
    if( evCb ) evCb( attId, defId, damage );
    
    // main attack
    damage = model.battleDamageAgainst(attacker,defender,attLuckRatio);
    model.damageUnit( defId, damage );
    
    // invoke main attack event
    evCb = controller.events.mainAttack;
    if( evCb ) evCb( attId, defId, damage );
    
    powerAtt -= model.unitHpPt( defender );
    
    if( model.canUseMainWeapon(attacker,defender) ) attacker.ammo--;
    
    powerAtt        = ( parseInt(        powerAtt*0.1*dSheets.cost, 10 ) );
    model.modifyPowerLevel( attOwner, parseInt( 0.5*powerAtt, 10 ) );
    model.modifyPowerLevel( defOwner, powerAtt );
    
    retreatVal = model.unitHpPt( defender )/retreatVal*100;
    if( retreatVal < 20 ){
      
      // retreat into a neighbor tile if possible
      retreatVal = searchTile( defender.x,defender.y, attacker.x,attacker.y );
    }
    else retreatVal = false;
    
    // counter attack when defender survives and defender is an indirect
    // attacking unit
    if( retreatVal && defender.hp > 0 && !model.isIndirectUnit(defId) ){
      var mainWpAttack = model.canUseMainWeapon(defender,attacker);
      
      damage = model.battleDamageAgainst( defender,attacker,defLuckRatio, mainWpAttack, true );
      model.damageUnit( attId, damage );  
      
      // invoke counter event
      evCb = controller.events.counterAttack;
      if( evCb ) evCb( defId, attId, damage );
      
      powerCounterAtt -= model.unitHpPt( attacker );
      
      if( mainWpAttack ) defender.ammo--;
      
      powerCounterAtt = ( parseInt( powerCounterAtt*0.1*aSheets.cost, 10 ) );
      model.modifyPowerLevel( defOwner, parseInt( 0.5*powerCounterAtt, 10 ) );
      model.modifyPowerLevel( attOwner, powerCounterAtt );
    }
    
  };
});