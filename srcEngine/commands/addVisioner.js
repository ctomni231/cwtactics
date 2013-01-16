controller.registerCommand({

  key:"addVisioner",

  // ------------------------------------------------------------------------
  condition: function( data ){
    return false;
  },

  // ------------------------------------------------------------------------
  action: function( data ){
    model.setVisioner(
      data.getSourceX(),
      data.getSourceY(),
      data.getSubAction()
    );
  }
});