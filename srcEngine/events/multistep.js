model.event_on( "multistep_next", function(){
  controller.stateMachine.event("nextStep");
});
