controller.screenStateMachine.structure.LOAD = Object.create(controller.stateParent);

controller.screenStateMachine.structure.LOAD.section = "cwt_load_screen";

controller.screenStateMachine.structure.LOAD.enterState = function(){
  controller.dataLoader_start(
  	document.getElementById("loading_text"),
  	document.getElementById("loading_bar")
  );
};

controller.screenStateMachine.structure.LOAD.complete = function(){
	return "MOBILE";
};

controller.screenStateMachine.structure.LOAD.onerror = controller.haltEngine;