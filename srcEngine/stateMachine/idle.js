/**
 * The base state of a game round. An action process starts here, the 
 * action data of the state machine is always empty in this state.
 */
controller.stateMachine.structure.IDLE = {

  onenter: function(){
    this.data.cleanMenu();
    this.data.cleanMovepath();
    this.data.menuSize = 0;
    this.data.inMultiStep = false;
    this.data.action = null;
    this.data.subAction = null;
    this.data.setTarget(-1,-1);
    this.data.setSource(-1,-1);
    this.data.setSelectionTarget(-1,-1);
    this.history.splice(0);
  },

  action: function(ev, x, y){
    var mem = this.data;

    mem.setSource(x, y);

    if ( mem.sourceUnitId !== CWT_INACTIVE_ID && mem.sourceUnit.owner === model.turnOwner && model.canAct(mem.sourceUnitId)){
      return "MOVEPATH_SELECTION";
    } 
    else{
      this.data.setTarget(x,y);
      return "ACTION_MENU";
    }
  },

  cancel: function ( ev,x,y ) {
    return "IDLE_R";
  }

};