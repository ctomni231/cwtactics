/**
 * Action menu state that generates a list of possible action for a 
 * selected target tile.
 */
controller.stateMachine.structure.ACTION_MENU = {
  
    onenter: function(){
      
      this.data.cleanMenu();
      this.data.prepareMenu();

      if( this.data.menuSize === 0 ){        
        this.data.setTarget( -1,-1 );
        return this.BREAK_TRANSITION;
      }
    },
  
    action:function( ev, index ){
      var action = this.data.menu[ index ];
      var actObj = controller.getActionObject( action );
      
      this.data.action = action;
      this.data.actionObject = actObj;

      if( actObj.prepareMenu !== null ){
        return "ACTION_SUBMENU";
      }
      else if( actObj.isTargetValid !== null ){
        return "ACTION_SELECT_TILE";
      }
      else if( actObj.prepareTargets !== null && actObj.targetSelectionType === "A" ){
        return this.data.prepareSelection();
      }
      else return "FLUSH_ACTION";
    },

    cancel:function(){
      this.data.setTarget(-1,-1);
      return this.lastState;
    }
}