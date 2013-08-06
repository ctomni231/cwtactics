controller.registerInvokableCommand("invokeNextStep_");

controller.defineEvent("invokeNextStep_");

// Invokes the next step for multistep actions.
//
// @private
model.invokeNextStep_ = function(){
  controller.stateMachine.event("nextStep");
  controller.events.invokeNextStep_();
};