controller.registerCommand({

  key: "wait",

  // -----------------------------------------------------------------------
  condition: function( data ){
    var selectedUnit = data.getSourceUnit();
    if( selectedUnit === null || selectedUnit.owner !== model.turnOwner ){
      return false;
    }

    var targetUnit = data.getTargetUnit();
    return targetUnit === null || targetUnit === selectedUnit;
  },

  // -----------------------------------------------------------------------
  action: function( data ){
    model.markAsUnusable( data.getSourceUnitId() );
  }

});