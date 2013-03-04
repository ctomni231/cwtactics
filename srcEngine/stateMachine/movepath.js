 controller.stateMachine.structure.MOVEPATH_SELECTION = {
  
    onenter: function( ev, x,y ){},
  
    action: function( ev,x,y ){
      if( this.data.getSelectionValueAt(x,y) < 0){
        if( CLIENT_DEBUG ){
          util.log("break event because selection is not in the map");
        }

        return this.BREAK_TRANSITION;
      }

      var ox = this.data.targetX;
      var oy = this.data.targetY;
      var dis = model.distance( ox,oy, x,y );

      this.data.setTarget( x,y );

      if( dis === 0 ){
        return "ACTION_MENU";
      }
      else if( dis === 1 ){

        // ADD TILE TO PATH
        var code = model.moveCodeFromAtoB( ox,oy, x,y );
        model.addCodeToPath( this.data, x,y, code );
        return this.BREAK_TRANSITION;
      }
      else{

        // GENERATE PATH
        model.setPathByRecalculation( this.data, x,y );
        return this.BREAK_TRANSITION;
      }
    },

    cancel: function(){

      this.data.setTarget(-1,-1);
      return this.lastState;
    }
  
}