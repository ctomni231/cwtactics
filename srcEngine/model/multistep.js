// commands
controller.action_registerCommands("multistep_nextStep_");

// events
model.event_define("multistep_nextStep_");

// Invokes the next step for multistep actions.
//
model.multistep_nextStep_ = function(){
  controller.stateMachine.event("nextStep");
  model.events.multistep_nextStep_();
};