controller.screenStateMachine.structure.NONE = Object.create(controller.stateParent);

controller.screenStateMachine.structure.NONE.start = function(){
  
  window.onerror = function( e ){
    model.criticalError(
      constants.error.UNKNOWN,
      constants.error.NON_CAUGHT_ERROR
    );
      
    console.error("FOUND ERROR: "+e);
  };
  
  return "LOAD"; 
};