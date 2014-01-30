cwt.gameFlow.FLUSH_ACTION = {
  actionState: function () {
    var trapped = controller.actionBuilder_buildFromUserData();

    // IF ACTION IS A MULTISTEP ACTION THEN PLACE A SYMBOLIC WAIT COMMAND
    if (!trapped && this.data.action.object.multiStepAction) {
      this.data.breakMultiStep = false;

      if( !controller.stateMachine.data.breakMultiStep ){
        controller.stateMachine.event("nextStep");
      } else {
        controller.stateMachine.event("nextStepBreak");
      }

      return "MULTISTEP_IDLE";
    } else return "IDLE";
  }
};