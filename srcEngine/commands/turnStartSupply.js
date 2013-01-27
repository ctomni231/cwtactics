controller.registerCommand({

  key:"supplyTurnStart",
  userAction: false,

  // -----------------------------------------------------------------------
  condition: function( data ){
    return false;
  },

  // -----------------------------------------------------------------------
  action: function( data ){
    controller.invokeCommand( data, "supply" );
    controller.invokeCommand( data, "makeActable" );
  }
});