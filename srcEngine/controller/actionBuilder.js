// Builds several commands from collected action data.
//
controller.buildAction = function(){
  var scope = controller.stateMachine.data;
  
  var targetDto     = scope.target;
  var sourceDto     = scope.source;
  var moveDto       = scope.movePath;
  var actionDto     = scope.action;
  // var actionObject  = controller.actionObjects[actionDto.selectedEntry];
  var actionObject  = actionDto.object;
  var trapped       = false;
  
  // ADD MOVE PATH
  if( moveDto.data.length > 0 ){
    
    // TRAPPED ?
    if( moveDto.data !== null ){
      var way = moveDto.data;
      
      var cx = sourceDto.x;
      var cy = sourceDto.y;
      for( var i=0,e=way.length; i<e; i++ ){
        
        switch( way[i] ){
          case model.moveCodes.DOWN  : cy++; break;
          case model.moveCodes.UP    : cy--; break;
          case model.moveCodes.LEFT  : cx--; break;
          case model.moveCodes.RIGHT : cx++; break;
        }
        
        var unit = model.unitPosMap[cx][cy];
        if( unit !== null ){
          
          if( model.players[model.turnOwner].team !==
             model.players[unit.owner].team ){
            
            // CONVERT TO TRAP WAIT
            targetDto.set(cx,cy);
            way.splice( i );
            trapped = true;
          }
        }
      }
    }
    
    // MOVE COMMAND
    controller.sharedInvokement( "moveUnit", [ moveDto.clone(), sourceDto.unitId, sourceDto.x, sourceDto.y ]);
  }
  
  // ACTION COMMAND
  if( !trapped ) actionObject.invoke( scope );
  else controller.sharedInvokement( "trapWait", [ sourceDto.unitId ]);
  
  // UNIT ACTIONS LEADS INTO A WAIT COMMAND 
  if( actionObject.unitAction && actionDto.selectedEntry !== "wait" ){
    controller.sharedInvokement( "markUnitNonActable", [ sourceDto.unitId ]);
  }
  
  return trapped;
};