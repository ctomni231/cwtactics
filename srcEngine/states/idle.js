/**
 * The base state of a game round. An action process starts here, the 
 * action data of the state machine is always empty in this state.
 */
controller.stateMachine.structure.IDLE = {
  onenter: function(){
    this.data.menu.clean();
    this.data.movePath.clean();
    
    this.data.action.selectedEntry = null;
    this.data.action.selectedSubEntry = null;
    this.data.action.object = null;
    
    this.history.splice(0);
    
    this.data.inMultiStep = false;
    this.data.makeMultistep = true;
    
    this.data.source.clean();
    this.data.target.clean();
    this.data.targetselection.clean();
  },
  
  action: function(ev, x, y){
    this.data.source.set(x,y);
    
    if ( this.data.source.unitId !== CWT_INACTIVE_ID && 
        this.data.source.unit.owner === model.turnOwner && 
        model.canAct( this.data.source.unitId ) ){
      
      this.data.target.set(x,y);
      this.data.movePath.clean();
      this.data.movePath.fillMoveMap();
      return "MOVEPATH_SELECTION";
    } 
    else{
      this.data.target.set( x,y );
      return "ACTION_MENU";
    }
  },
  
  cancel: function ( ev,x,y ) {
    return this.BREAK_TRANSITION;
  }
};