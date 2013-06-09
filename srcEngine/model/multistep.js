/**
 * Invokes the next step for multistep actions.
 * 
 * @private
 */
model.invokeNextStep_ = function(){
  controller.stateMachine.event("nextStep");
};