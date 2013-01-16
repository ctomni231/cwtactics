controller.registerCommand({

  key:"remVisioner",

  // ------------------------------------------------------------------------
  condition: function( data ){
    return false;
  },

  // ------------------------------------------------------------------------
  action: function( data ){
    model.removeVisioner(
      data.getSourceX(),
      data.getSourceY(),
      data.getSubAction()
    );
  }
});