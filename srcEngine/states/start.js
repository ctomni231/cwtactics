/**
 * The start state of the cwt state machine.
 */
controller.stateMachine.structure.NONE = {
  
  start: function( ev, mod ){

    // LOAD MODIFICATION
    model.loadModification( mod );
    
    return "IDLE";
  }
  
};