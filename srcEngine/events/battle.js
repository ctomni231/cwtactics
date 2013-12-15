// Declines when game round is in peace phase.
//
model.event_on( "attack_check",function( wish ){
  if( model.round_day < controller.configValue("daysOfPeace") ) return false;
});

// Declines when the attacker is an indirect unit and moved this turn.
//
model.event_on( "attack_check",function(  uid, x,y, move ){
  if( model.battle_isIndirectUnit(uid) && move.data.getSize() > 0 ){
    return false;
  }
});

// Declines when the attacker does not have targets in range.
//
model.event_on( "attack_check",function(  uid, x,y ){
  if( !model.battle_calculateTargets(uid,x,y) ) return false;
});

// Declines when the attacker does not have targets in range.
//
model.event_on( "attack_invoked",function( attId, defId, attLuckRatio, defLuckRatio ){
  assert( model.unit_isValidUnitId(attId) );
  assert( model.unit_isValidUnitId(defId) );
  assertIntRange(attLuckRatio,0,100);
  assertIntRange(defLuckRatio,0,100);

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
  model.events.battle_invokeBattle( attId, defId, damage );

  // main attack
  var mainWpAttack = model.battle_canUseMainWeapon(attacker,defender);
  damage = model.battle_getBattleDamageAgainst(attacker,defender,attLuckRatio,mainWpAttack,false);

  if( damage !== -1 ){
    model.unit_inflictDamage( defId, damage );

    // invoke main attack event
    model.events.battle_mainAttack( attId, defId, damage, mainWpAttack );

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
      defender,
      attacker,
      defLuckRatio,
      mainWpAttack,
      true
    );

    if( damage !== -1 ){
      model.unit_inflictDamage( attId, damage );

      // invoke counter event
      model.events.battle_counterAttack( defId, attId, damage, mainWpAttack );

      powerCounterAtt -= model.unit_convertHealthToPoints( attacker );

      if( mainWpAttack ) defender.ammo--;

      powerCounterAtt = ( parseInt( powerCounterAtt*0.1*aSheets.cost, 10 ) );
      model.co_modifyPowerLevel( defOwner, parseInt( 0.5*powerCounterAtt, 10 ) );
      model.co_modifyPowerLevel( attOwner, powerCounterAtt );
    }
  }
});

model.event_on("attackUnit_unitAttacks",function( uid ){

});
