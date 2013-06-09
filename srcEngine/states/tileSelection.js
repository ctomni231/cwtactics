/**
 * The client selects a target tile in this step. Unlike {@link controller.stateMachine.structure.ACTION_SELECT_TARGET_A}
 * and {@link controller.stateMachine.structure.ACTION_SELECT_TARGET_B} this state allows a free selection
 * over the map. Normally this state will be invoked by actions with the isTargetValid attribute. 
 */
controller.stateMachine.structure.ACTION_SELECT_TILE = {
  
  onenter: function(){
    this.data.targetselection.clean();
  },
  
  action: function( ev,x,y ){      
    if( this.data.action.object.isTargetValid( this.data, x,y) ){
      this.data.targetselection.set(x,y);
      
      return "FLUSH_ACTION";
    }
    else return this.BREAK_TRANSITION;
  },
  
  cancel: function(){
    this.data.targetselection.clean();
    return this.lastState;
  }
  
};