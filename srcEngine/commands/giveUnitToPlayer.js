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
   * @param {Number} tpod the id of the new owner
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
    
    model.unitPosMap[ selectedUnit.x ][ selectedUnit.y ] = null;
    controller.actions.removeVision( selectedUnit.x, selectedUnit.y, model.sheets[ selectedUnit.type ].vision );

    var tid = model.createUnit( tpid, selectedUnit.type );
    var targetUnit = model.units[ tid ];
    targetUnit.hp = selectedUnit.hp;
    targetUnit.ammo = selectedUnit.ammo;
    targetUnit.fuel = selectedUnit.fuel;
    targetUnit.exp = selectedUnit.exp;
    targetUnit.type = selectedUnit.type;
    targetUnit.x = tx;
    targetUnit.y = ty;
    targetUnit.loadedIn = selectedUnit.loadedIn;
    
    model.unitPosMap[ cX ][ cY ] = targetUnit;
    if( model.players[tpid].team === model.players[opid].team ){
      controller.actions.addVision(  targetUnit.x, targetUnit.y, model.sheets[ targetUnit.type ].vision );
    }
  }

});