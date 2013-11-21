model.data_unitParser.addHandler(function(sheet){
  assert( util.intRange(sheet.ammo, 0,9 ) );
  
  // attack can be set
  if( !util.isUndefined(sheet.attack) ){
    
    // if range is set then the unit will be an indirect unit
    if( !util.isUndefined(sheet.attack.minRange) ){
      assert( util.intRange(sheet.attack.minRange, 1,14 ) );
      assert( util.intRange(sheet.attack.maxRange, 2,15 ) );
      assert( sheet.attack.maxRange>sheet.attack.minRange );
    }
    
    // check attack values
    for( var i=0,e=model.battle_WEAPON_KEYS.length; i<e; i++ ){
      // TODO: check attack values
    }
  }
});

model.data_tileParser.addHandler(function(sheet){
  assert( util.intRange(sheet.defense, 0,6 ) );
});