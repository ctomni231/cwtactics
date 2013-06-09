/**
 * Action state that converts the collected action data from client
 * to sharable transactions and pushes them into the action stack.
 */
controller.stateMachine.structure.FLUSH_ACTION = {
  
  actionState: function(){
    var trapped = controller.buildAction();
    
    // IF ACTION IS A MULTISTEP ACTION THEN PLACE A SYMBOLIC WAIT COMMAND
    if( !trapped && this.data.action.object.multiStepAction ){
      // this.data.inMultiStep = true;
      model.invokeNextStep_.callAsCommand();
      return "MULTISTEP_IDLE";
    }
    else return "IDLE";
  }
  
};