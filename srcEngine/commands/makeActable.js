controller.registerCommand({

  key: "makeActable",
  userAction: false,

  // -----------------------------------------------------------------------
  condition: function( data ){
    return false;
  },

  // -----------------------------------------------------------------------
  action: function( data ){
    model.leftActors[ data.getSourceUnitId() ] = true;
  }

});