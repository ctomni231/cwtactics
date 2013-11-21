controller.event_on("multistep_nextStep_",function(){
  if( controller.stateMachine.state !== "IDLE" ){
    controller.showMenu(
      controller.stateMachine.data.menu,
      controller.mapCursorX,
      controller.mapCursorY
    );
  }
});