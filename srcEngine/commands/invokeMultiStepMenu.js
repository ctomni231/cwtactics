controller.engineAction({

  name:"invokeMultiStepAction",
  key:"IVMS",

  /**
   * Invokes a multi step action.
   *
   * @methodOf controller.actions
   * @name invokeMultiStepAction
   */
  action: function(){
    controller.stateMachine.event("nextStep");
  }
});