cwt.gameFlow.FLUSH_ACTION = {
  actionState: function () {
    var trapped = controller.actionBuilder_buildFromUserData();

    // IF ACTION IS A MULTISTEP ACTION THEN PLACE A SYMBOLIC WAIT COMMAND
    if (!trapped && this.data.action.object.multiStepAction) {
      this.data.breakMultiStep = false;
      // this.data.inMultiStep = true;
      controller.commandStack_localInvokement("multistep_next");
      return "MULTISTEP_IDLE";
    } else return "IDLE";
  }
};