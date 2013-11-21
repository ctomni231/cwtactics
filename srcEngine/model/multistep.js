// commands
controller.action_registerCommands("multistep_nextStep_");

// events
controller.event_define("multistep_nextStep_");

// Invokes the next step for multistep actions.
//
model.multistep_nextStep_ = function(){
  controller.stateMachine.event("nextStep");
  controller.events.multistep_nextStep_();
};