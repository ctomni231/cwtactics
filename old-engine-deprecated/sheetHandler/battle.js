model.event_on("parse_unit",function( sheet ){
  assertIntRange( sheet.ammo, 0,9 );

  // attack can be set
  if( sheet.attack ){

    // if range is set then the unit will be an indirect unit
    if( !util.isUndefined(sheet.attack.minRange) ){
      assertIntRange( sheet.attack.minRange, 1,14 );
      assertIntRange( sheet.attack.maxRange, 2,15 );
      assert( sheet.attack.maxRange>sheet.attack.minRange );
    }

    // TODO: indirect has only one main weapon, no side weapon

    // check attack values
    for( var i=0,e=model.battle_WEAPON_KEYS.length; i<e; i++ ){
      // TODO: check attack values
    }
  }
});

model.event_on("parse_tile",function( sheet ){
  assertIntRange( sheet.defense, 0,6 );
});
