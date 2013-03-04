controller.userAction({

  name:"unhideUnit",
  
  key:"UHUN",
  
  unitAction: true,
  
  condition: function( mem ){
    if( mem.targetUnit !== null ) return false;
    
    var unit = mem.sourceUnit;
    if( unit === null ) return false;
    
    return unit.hidden;
  },
  
  createDataSet: function( mem ){
    return [ mem.sourceUnitId ];
  },
  
  /**
   * Unhides an unit.
   *
   * @param {Number} uid unit id
   *
   * @methodOf controller.actions
   * @name unhideUnit
   */
  action: function( uid ){
    model.units[uid].hidden = false;
  }
});