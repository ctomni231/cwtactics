controller.userAction({

  name:"join",
  key:"JNUN",
  
  unitAction: true,

  condition: function( mem ){
    var selectedUnit = mem.sourceUnit;
    var targetUnit = mem.targetUnit;
    
    if( selectedUnit === null || 
        targetUnit === null || 
        targetUnit.owner !== model.turnOwner ||
        targetUnit === selectedUnit ) return false;
    
    // NO LOAD MERGE
    if( model.hasLoadedIds( mem.sourceUnitId ) || 
        model.hasLoadedIds( mem.targetUnitId ) ) return false;

    return ( selectedUnit.type === targetUnit.type && targetUnit.hp < 89 );
  },
  
  createDataSet: function( mem ){
    return [ mem.sourceUnitId, mem.targetUnitId ];
  },

  /**
   * Joins an unit into an other.
   *
   * @param {Number} pid source unit id
   * @param {Number} tid target unit id
   *
   * @methodOf controller.actions
   * @name join
   */
  action: function( sid, tid ){
    var joinSource = model.units[sid];
    var joinTarget = model.units[tid];
    var junitSheet = model.sheets.unitSheets[ joinTarget.type ];

    // HEALTH POINTS
    controller.actions.healUnit( tid, joinSource.hp );

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

    controller.actions.destroyUnit( sid );
    controller.actions.wait( tid );
  }
});