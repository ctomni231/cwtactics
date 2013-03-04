controller.userAction({

  name:"hideUnit",
  
  key:"HIUN",
  
  unitAction: true,
  
  condition: function( mem ){
    if( mem.targetUnit !== null ) return false;
    
    var unit = mem.sourceUnit;
    if( unit === null ) return false;
    if( unit.hidden ) return false;
    
    var sheet = model.sheets.unitSheets[ unit.type ];
    
    return sheet.canHide;
  },
  
  createDataSet: function( mem ){
    return [ mem.sourceUnitId ];
  },
  
  /**
   * Hides an unit.
   *
   * @param {Number} uid unit id
   *
   * @methodOf controller.actions
   * @name hideUnit
   */
  action: function( uid ){
    model.units[uid].hidden = true;
  }
});