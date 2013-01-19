controller.registerCommand({

  key: "trapWait",

  // -----------------------------------------------------------------------
  condition: function( data ){
    return false;
  },

  // -----------------------------------------------------------------------
  action: function( data ){
    var ndata = new controller.ActionData();
    ndata.setSource( data.getSourceX(), data.getSourceY() );
    ndata.setAction("wait");
    ndata.setSourceUnit( data.getSourceUnit() );
    controller.invokeCommand( ndata );
  }

});