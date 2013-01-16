controller.registerCommand({

  key: "trapWait",

  // -----------------------------------------------------------------------
  condition: function( data ){
    return false;
  },

  // -----------------------------------------------------------------------
  action: function( data ){
    data.setAction("wait");
    controller.invokeCommand(data);
  }

});