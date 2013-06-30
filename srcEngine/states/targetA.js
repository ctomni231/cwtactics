/**
 * The client selects a target tile in this step. The selected action generates a map of
 * selectable tiles. This selection will be invoked before(!) the sub menu.
 */
controller.stateMachine.structure.ACTION_SELECT_TARGET_A = {
  
  onenter: function(){
    this.data.targetselection.clean();
  },
  
  action: function( ev,x,y ){
    if( this.data.selection.getValueAt(x,y) < 0){
      if( DEBUG ) util.log("break event because selection is not in the map");
      return this.BREAK_TRANSITION;
    }
    
    this.data.targetselection.set(x,y);
    
    return "FLUSH_ACTION";
  },
  
  cancel: function(){
    return this.lastState;
  }
  
};