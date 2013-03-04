/**
 * Action sub menu state that generates a list of possible sub actions for 
 * an action to modify the selected action like select an unit that should
 * be unloaded.
 */
controller.stateMachine.structure.ACTION_SUBMENU = {
  
  onenter: function( ev, x,y ){
    if( !this.data.inMultiStep ){
      this.data.cleanMenu();
      controller.getActionObject( this.data.action ).prepareMenu( this.data );
      if( this.data.menuSize === 0 ){        
        util.raiseError("sub menu cannot be empty");
      }
    }
  },
  
  action: function( ev, index ){
    var action = this.data.menu[ index ];
    
    if( action === "done" ){
      return "IDLE";
    }
    
    this.data.subAction = action;
    
    if( this.data.actionObject.prepareTargets !== null && 
        this.data.actionObject.targetSelectionType === "B" ){
      
      return this.data.prepareSelection();
    }
    else return "FLUSH_ACTION";
  },
  
  
  cancel: function(){
    if( this.data.inMultiStep ) return this.lastState;
    
    this.data.cleanMenu();
    this.data.prepareMenu();
    
    return this.lastState;
  }
}