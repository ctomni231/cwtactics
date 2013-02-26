/**
 * Available from the {@link controller.stateMachine.structure.IDLE_R} state
 * and generates, if available, an attack range for a selected unit.
 */
controller.stateMachine.structure.IDLE_R = {

  onenter: function( ev, x,y ){
    this.data.setSource(x,y);
    if( this.data.sourceUnit !== null ){

      controller.getActionObject("ATUN").fillAttackableTiles( this.data );
    }
    else return this.BREAK_TRANSITION;
  },

  cancel: function () {
    return "IDLE";
  }

};