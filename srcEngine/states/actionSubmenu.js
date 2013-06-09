/**
 * Action sub menu state that generates a list of possible sub actions for 
 * an action to modify the selected action like select an unit that should
 * be unloaded.
 */
controller.stateMachine.structure.ACTION_SUBMENU = {
  
  onenter: function(){
    if( !this.data.inMultiStep ){
      this.data.menu.clean();
      this.data.action.object.prepareMenu( this.data );
      if( this.data.menu.size === 0 ){        
        util.raiseError("sub menu cannot be empty");
      }
    }
  },
  
  action: function( ev, index ){
    var action = this.data.menu.data[ index ];
    
    if( action === "done" ){
      return "IDLE";
    }
    
    this.data.action.selectedSubEntry = action;
    
    if( this.data.action.object.prepareTargets !== null && 
        this.data.action.object.targetSelectionType === "B" ){
      
      return this.data.selection.prepare();
    }
    else return "FLUSH_ACTION";
  },
  
  
  cancel: function(){
    if( this.data.inMultiStep ) return this.lastState;
    
    this.data.menu.clean();
    this.data.menu.generate();
    
    return this.lastState;
  }
};