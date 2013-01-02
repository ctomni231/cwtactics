controller.registerCommand({

  key:"join",
  unitAction: true,

  // ----------------------------------------------------------------------
  condition: function( data ){
    var selectedUnit = data.getSourceUnit();
    var targetUnit = data.getTargetUnit();
    if( targetUnit === null || targetUnit.owner !== model.turnOwner ||
        targetUnit === selectedUnit ) return false;

    return ( selectedUnit.type === targetUnit.type && targetUnit.hp < 89 );
  },

  // ----------------------------------------------------------------------
  action: function( data ){
    var joinSource = data.getSourceUnit();
    var joinTarget = data.getTargetUnit();

    
    var junitSheet = model.sheets.unitSheets[ joinTarget.type ];

    // HEALTH POINTS
    joinTarget.hp += joinSource.hp;
    if( joinTarget.hp > 99 ) joinTarget.hp = 99;

    // AMMO
    joinTarget.ammo += joinSource.ammo;
    if( joinTarget.ammo > junitSheet.maxAmmo ){
      joinTarget.ammo = junitSheet.maxAmmo;
    }

    // FUEL
    joinTarget.fuel += joinSource.fuel;
    if( joinTarget.fuel > junitSheet.maxFuel ){
      joinTarget.fuel = junitSheet.maxFuel;
    }

    model.destroyUnit( model.extractUnitId(joinSource) );
    
    // CHANGE SCOPE OF SELECTED UNIT TO TARGET
    data.setSourceUnit( joinTarget );
    controller.invokeCommand( data, "wait" );
  }
});