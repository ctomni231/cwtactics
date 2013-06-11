/**
 * Returns true if a given unit is an indirect firing unit (e.g. artillery) else false
. * 
 * @param {type} uid id of the unit
 * @returns {Boolean}
 */
model.isIndirectUnit = function( uid ){
  return typeof model.units[uid].type.minrange === "number"; 
};

/**
 * Returns the base damage of an attacker against a defender. If the attacker cannot attack
 * the defender then -1 will be returned. This function recognizes the ammo usage of main weapons.
 * If the attacker cannot attack with his main weapon due low ammo then only the secondary weapon 
 * will be checked.
 * 
 * @returns {Boolean}
 */
model.baseDamageAgainst = function( attacker, defender, withMainWp ){
  var attack = attacker.type.attack;
  var tType = defender.type.ID;
  var v;
  
  if( typeof withMainWp === "undefined" ) withMainWp = true;
  
  // MAIN WEAPON
  if( withMainWp && attacker.ammo > 0 && attack.main_wp !== undefined ){
    v = attack.main_wp[tType];
    if( typeof v === "number" ) return v;
  }
  
  // SECONDARY WEAPON
  if( attack.sec_wp !== undefined ){ 
    v = attack.sec_wp[tType];
    if( typeof v === "number" ) return v;
  }
  
  return -1;
};

model.canUseMainWeapon = function( attacker, defender ){
  var attack = attacker.type.attack;
  var tType = defender.type.ID;
  var v;
  
  // MAIN WEAPON
  if( attacker.ammo > 0 && attack.main_wp !== undefined ){
    v = attack.main_wp[tType];
    if( typeof v === "number" ) return true;
  }
  
  return false;
};

/**
 * Returns true if the unit type has a main weapon else false.
 * 
 * @param {UnitSheet} type
 * @returns {Boolean}
 */
model.hasMainWeapon = function( type ){
  var attack = type.attack;
  return typeof attack !== "undefined" && typeof attack.main_wp !== "undefined";
};

/**
 * Returns true if the unit type has a secondary weapon else false.
 * 
 * @param {UnitSheet} type
 * @returns {Boolean}
 */
model.hasSecondaryWeapon = function( type ){
  var attack = type.attack;
  return typeof attack !== "undefined" && typeof attack.sec_wp !== "undefined";
};

/**
 * 
 * @param {Number} uid
 * @param {Number} x
 * @param {Number} y
 * @param {SelectionData} data
 * @returns {Boolean}
 */
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
    minR = controller.scriptedValue( unit.owner, "minRange", unit.type.attack.minrange );
    maxR = controller.scriptedValue( unit.owner, "maxRange", unit.type.attack.maxrange );
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

/**
 * Returns true if an unit has targets in sight, else false.
 * 
 * @param {type} uid id of the unit
 * @param {Number} x (default: unit position)
 * @param {Number} y (default: unit position)
 * @returns {Boolean}
 */
model.hasTargets = function( uid,x,y ){
  return model.attackRangeMod_(uid,x,y);
};

/**
 *
 */
model.getBattleDamage = function( attacker, defender, luck, withMainWp, isCounter ){
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

/**
 * 
 * @param {type} attId id of the attacker
 * @param {type} defId id of the defender
 * @param {type} attLuckRatio luck of the attacker (0-100)
 * @param {type} defLuckRatio luck of the defender (0-100)
 */
model.battleBetween = function( attId, defId, attLuckRatio, defLuckRatio ){
  var attacker = model.units[attId];
  var defender = model.units[defId];
  var aSheets = attacker.type;
  var dSheets = defender.type;
  var attOwner = attacker.owner;
  var defOwner = defender.owner;
  var powerAtt        = model.unitHpPt( defender );
  var powerCounterAtt = model.unitHpPt( attacker );
  
  // ATTACK
  model.damageUnit( defId, model.getBattleDamage(attacker,defender,attLuckRatio) );
  powerAtt -= model.unitHpPt( defender );
  
  if( model.canUseMainWeapon(attacker,defender) ) attacker.ammo--;
  
  powerAtt        = ( parseInt(        powerAtt*0.1*dSheets.cost, 10 ) );
  model.modifyPowerLevel( attOwner, parseInt( 0.5*powerAtt, 10 ) );
  model.modifyPowerLevel( defOwner, powerAtt );
  
  // COUNTER ATTACK
  if( defender.hp > 0 && !model.isIndirectUnit(defId) ){
    var mainWpAttack = model.canUseMainWeapon(defender,attacker);
    
    model.damageUnit( attId, model.getBattleDamage(
      defender,attacker,defLuckRatio, mainWpAttack, true
    ));  
    
    powerCounterAtt -= model.unitHpPt( attacker );
    
    if( mainWpAttack ) defender.ammo--;
    
    powerCounterAtt = ( parseInt( powerCounterAtt*0.1*aSheets.cost, 10 ) );
    model.modifyPowerLevel( defOwner, parseInt( 0.5*powerCounterAtt, 10 ) );
    model.modifyPowerLevel( attOwner, powerCounterAtt );
  }
};