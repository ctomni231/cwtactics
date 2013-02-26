controller.engineAction({

  name:"destroyUnit",
  
  key:"DEUN",
  
  /**
   * Destroys an unit.
   *
   * @param {Number} uid unit id
   *
   * @methodOf controller.actions
   * @name destroyUnit
   */
  action: function( uid ){
    
    var unit = model.units[uid];
    
    // controller.actions.removeVision( unit.x, unit.y, model.sheets.unitSheets[ unit.type ].vision );
    if( unit.owner === model.turnOwner ){
      controller.pushAction( unit.x, unit.y, model.sheets.unitSheets[ unit.type ].vision, "RVIS" );
    }
    
    unit.owner = CWT_INACTIVE_ID;
    model.unitPosMap[ unit.x ][ unit.y ] = null;
    //unit.x = -1;
    //unit.y = -1;
  }
});