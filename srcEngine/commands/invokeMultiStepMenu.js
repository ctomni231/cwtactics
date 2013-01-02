controller.registerCommand({

  key:"invokeMultiStepAction",

  // ----------------------------------------------------------------------
  condition: util.FUNCTION_FALSE_RETURNER,

  // ----------------------------------------------------------------------
  action: function( data ){
    controller.input.event("nextStep");
  }
});