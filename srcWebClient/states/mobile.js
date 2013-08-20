controller.screenStateMachine.structure.MOBILE = Object.create(controller.stateParent);

controller.screenStateMachine.structure.MOBILE.section = "cwt_mobileSound_screen";

controller.screenStateMachine.structure.MOBILE.enterState = function(){};

controller.screenStateMachine.structure.MOBILE.ACTION = function(){ 
  return "MAIN"; 
};