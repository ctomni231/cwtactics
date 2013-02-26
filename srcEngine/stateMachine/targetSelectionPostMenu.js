/**
 * The client selects a target tile in this step. The selected action generates a map of
 * selectable tiles. This selection will be invoked before(!) the sub menu.
 */
controller.stateMachine.structure.ACTION_SELECT_TARGET_A = {
    
    action: function( ev,x,y ){
      
      if( this.data.getSelectionValueAt(x,y) < 0){
        if( CLIENT_DEBUG ){
          util.log("break event because selection is not in the map");
        }

        return this.BREAK_TRANSITION;
      }

      this.data.setSelectionTarget(x,y);
      return "FLUSH_ACTION";
    },

    cancel: function(){
      return this.lastState;
    }
  
};