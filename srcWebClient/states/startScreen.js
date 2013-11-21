controller.screenStateMachine.startScreen_toolTipId = -1;

controller.screenStateMachine.structure.MOBILE = Object.create(controller.stateParent);

controller.screenStateMachine.structure.MOBILE.section = "cwt_mobileSound_screen";

controller.screenStateMachine.structure.MOBILE.enterState = function(){
  // SET BACKGROUND
  controller.storage.get("MAIN_BG", controller.imgToBg);    
};

controller.screenStateMachine.structure.MOBILE.ACTION = function(){ 
  controller.stateMachine.event("start");
  return "MAIN"; 
};

// Decreases the id of the current active tooltip. The list of available tooltips are available
// in the modification file.
//
controller.screenStateMachine.structure.MOBILE.LEFT = function(){
  controller.screenStateMachine.startScreen_toolTipId--;
  if( controller.screenStateMachine.startScreen_toolTipId < 0 ){
    controller.screenStateMachine.startScreen_toolTipId = model.data_tooltips.length-1;
  }

  // TODO: set content
};

// Increases the id of the current active tooltip. The list of available tooltips are available
// in the modification file.
//
controller.screenStateMachine.structure.MOBILE.RIGHT = function(){
  controller.screenStateMachine.startScreen_toolTipId++;
  if( controller.screenStateMachine.startScreen_toolTipId >= model.data_tooltips.length ){
    controller.screenStateMachine.startScreen_toolTipId = 0;
  }

  // TODO: set content
};