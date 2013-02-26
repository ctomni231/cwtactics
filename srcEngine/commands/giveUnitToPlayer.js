controller.userAction({

  name:"giveUnitToPlayer",

  key:"GUTP",

  unitAction: true,
  hasSubMenu: true,

  condition: function( mem ){
    var selectedUnit = mem.sourceUnit;
    if( selectedUnit === null ) return false;
    if( mem.targetUnit !== null ) return false;
    
    var unit = mem.targetUnit;
    return unit !== selectedUnit;
  },

  prepareMenu: function( mem ){
    for( var i= 0,e=CWT_MAX_PLAYER; i<e; i++ ){
      if( i !== model.turnOwner && model.players[i].team !== CWT_INACTIVE_ID ){
        mem.addEntry(i);
      }
    }
  },

  createDataSet: function( mem ){
    return [ mem.sourceUnitId, mem.subAction ];
  },

  /**
   * Transfers a property of a player to an other player.
   *
   * @param {Number} uid unit id
   * @param {Number} tpid the id of the new owner
   *
   * @methodOf controller.actions
   * @name giveUnitToPlayer
   */
  action: function( uid, tpid ){
    var selectedUnit = model.units[uid];
    var tx = selectedUnit.x;
    var ty = selectedUnit.y;
    var opid = selectedUnit.owner;
    
    selectedUnit.owner = CWT_INACTIVE_ID;
    
    // controller.actions.removeVision( selectedUnit.x, selectedUnit.y, model.sheets[ selectedUnit.type ].vision );
    if( model.players[tpid].team !== model.players[opid].team ){
      controller.pushAction( selectedUnit.x, selectedUnit.y, model.sheets.unitSheets[ selectedUnit.type ].vision, "RVIS" );
    }
    
    model.unitPosMap[ selectedUnit.x ][ selectedUnit.y ] = null;
    
    controller.actions.createUnit( selectedUnit.x, selectedUnit.y, tpid, selectedUnit.type );
    var targetUnit =  model.unitPosMap[ selectedUnit.x ][ selectedUnit.y ];
    targetUnit.hp = selectedUnit.hp;
    targetUnit.ammo = selectedUnit.ammo;
    targetUnit.fuel = selectedUnit.fuel;
    targetUnit.exp = selectedUnit.exp;
    targetUnit.type = selectedUnit.type;
    targetUnit.x = tx;
    targetUnit.y = ty;
    targetUnit.loadedIn = selectedUnit.loadedIn;
  }

});