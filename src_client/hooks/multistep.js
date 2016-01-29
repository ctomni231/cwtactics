model.event_on("multistep_next",function(){
  if( controller.stateMachine.state !== "IDLE" ){
    controller.showMenu(
      controller.stateMachine.data.menu,
      controller.mapCursorX,
      controller.mapCursorY
    );
  }
});
