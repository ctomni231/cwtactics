/**
 * Action state that converts the collected action data from client
 * to sharable transactions and pushes them into the action stack.
 */
controller.stateMachine.structure.FLUSH_ACTION = {
  
  actionState: function(){
    var trapped = false;
    if( this.data.movePath !== null ){
      var way = this.data.movePath;
      
      var cx = this.data.sourceX;
      var cy = this.data.sourceY;
      for( var i=0,e=way.length; i<e; i++ ){
        
        switch( way[i] ){
          case model.MOVE_CODE_DOWN  : cy++; break;
          case model.MOVE_CODE_UP    : cy--; break;
          case model.MOVE_CODE_LEFT  : cx--; break;
          case model.MOVE_CODE_RIGHT : cx++; break;
        }
        
        var unit = model.unitPosMap[cx][cy];
        if( unit !== null ){
          
          // TRAPPED ?
          if( model.players[model.turnOwner].team !==
             model.players[unit.owner].team ){
            
            // CONVERT TO TRAP WAIT
            this.data.action = "TRWT";
            this.data.setTarget(cx,cy);
            way.splice( i );
            trapped = true;
          }
        }
      }
    }
    
    // PUSH A COPY INTO THE COMMAND BUFFER
    var action;
    var actObj;
    var actArgs;
    
    if( this.data.movePath.length > 0 ){
      action = "MOVE";
      actObj = controller.getActionObject( action );
      actArgs = actObj.createDataSet( this.data );
      actArgs.push(action);
      controller.pushSharedAction.apply( null, actArgs );
    }
    
    action = this.data.action;
    actObj = this.data.actionObject;
    actArgs = actObj.createDataSet( this.data );
    actArgs.push(action);
    controller.pushSharedAction.apply( null, actArgs );
    
    if( !trapped && actObj.multiStepAction ){
      this.data.inMultiStep = true;
      controller.pushSharedAction.apply( null, ["IVMS"] );
      return "MULTISTEP_IDLE";
    }
    else return "IDLE";
  }
  
};