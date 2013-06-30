/**
 * Action menu state that generates a list of possible action for a 
 * selected target tile.
 */
controller.stateMachine.structure.ACTION_MENU = {
  
  onenter: function(){
    this.data.menu.clean();
    this.data.menu.generate();
    if( this.data.menu.size === 0 ){        
      this.data.target.clean();
      return this.BREAK_TRANSITION;
    }
  },
  
  action:function( ev, index ){
    var action = this.data.menu.data[ index ];
    var actObj = controller.actionObjects[action];
    
    this.data.action.selectedEntry = action;
    this.data.action.object = actObj;
    
    if( actObj.prepareMenu !== null ) return "ACTION_SUBMENU";
    else if( actObj.isTargetValid !== null ) return "ACTION_SELECT_TILE";
    else if( actObj.prepareTargets !== null && actObj.targetSelectionType === "A" ) return this.data.selection.prepare();
    else return "FLUSH_ACTION";
  },
  
  cancel:function(){
    this.data.target.clean();
    return this.lastState;
  }
};