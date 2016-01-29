model.event_on( "multistep_next", function(){
  if( !controller.stateMachine.data.breakMultiStep ) controller.stateMachine.event("nextStep");
  else controller.stateMachine.event("nextStepBreak");
});
