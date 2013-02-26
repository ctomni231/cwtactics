controller.engineAction({

  name:"createUnit",
  
  key:"CRUN",
  
  /**
   * Creates an unit in the unit depot of a given player.
   *
   * @param {Number} x x coordinate
   * @param {Number} y y coordinate
   * @param {Number} pid player id of the player
   * @param {String} type type of the unit type
   *
   * @methodOf controller.actions
   * @name createUnit
   */
  action: function( x,y, pid, type ){

    var startIndex = pid*CWT_MAX_UNITS_PER_PLAYER;
    for( var i=startIndex, e=startIndex+CWT_MAX_UNITS_PER_PLAYER; i<e; i++ ){
  
      if( model.units[i].owner === CWT_INACTIVE_ID ){
  
        var typeSheet = model.sheets.unitSheets[ type ];
        var unit = model.units[i];
        unit.owner = pid;
        unit.hp = 99;
        unit.type = type;
        unit.ammo = typeSheet.maxAmmo;
        unit.fuel = typeSheet.maxFuel;
        unit.loadedIn = -1;
        unit.x = x;
        unit.y = y;
        
        model.unitPosMap[x][y] = unit;
        
        // controller.actions.addVision( unit.x, unit.y, model.sheets.unitSheets[ unit.type ].vision );
        if( pid === model.turnOwner ) controller.pushAction( unit.x, unit.y, model.sheets.unitSheets[ unit.type ].vision, "AVIS" );
        
        if( DEBUG ){
          util.log("build unit for player",pid,"in slot",i);
        }
        
        return;
      }
    }
  
    if( DEBUG ){
      util.raiseError("cannot build unit for player",pid,"no slots free");
    }
  }
});