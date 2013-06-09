controller.stateMachine.structure.MOVEPATH_SELECTION = {
  
  onenter: function( ev, x,y ){
    //this.data.target.clean();
  },
  
  action: function( ev,x,y ){
    if( this.data.selection.getValueAt(x,y) < 0){
      if( DEBUG ) util.log("break event because selection is not in the selection map");
      return this.BREAK_TRANSITION;
    }
    
    var ox = this.data.target.x;
    var oy = this.data.target.y;
    var dis = model.distance( ox,oy, x,y );
    
    this.data.target.set( x,y );
    
    if( dis === 0 ){
      return "ACTION_MENU";
    }
    else if( dis === 1 ){
      
      // ADD TILE TO PATH
      var code = model.moveCodeFromAtoB( ox,oy, x,y );
      controller.stateMachine.data.movePath.addCodeToPath( x,y, code );
      return this.BREAK_TRANSITION;
    }
      else{
        
        // GENERATE PATH
        controller.stateMachine.data.movePath.setPathByRecalculation( x,y );
        return this.BREAK_TRANSITION;
      }
  },
  
  cancel: function(){
    this.data.target.clean();
    return this.lastState;
  }
  
};