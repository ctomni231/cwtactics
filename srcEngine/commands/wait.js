controller.registerCommand({

  key: "wait",
  unitAction: true,

  // -----------------------------------------------------------------------
  condition: function( data ){
    var selectedUnit = data.getSourceUnit();
    var targetUnit = data.getTargetUnit();
    return targetUnit === null || targetUnit === selectedUnit;
  },

  // -----------------------------------------------------------------------
  action: function( data ){
    model.markAsUnusable( data.getSourceUnitId() );
  }

});