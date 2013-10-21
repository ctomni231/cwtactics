// ### Controller.buildAction
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
  
  // generate move path -> check traps
  if( moveDto.data[0] !== -1 ){
    
    if( DEBUG ){
      if( sourceDto.unitId === INACTIVE_ID ){
        model.errorLogicFault("flush actions","move path given, but not a mover");
      }
    }

    var way = moveDto.data;
    var cx = sourceDto.x;
    var cy = sourceDto.y;

    for( var i=0,e=way.length; i<e; i++ ){
      
      // end of way
      if( way[i] === -1 ) break;

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
          
          // convert to `trapWait`
          targetDto.set(cx,cy);
          way.splice( i );
          trapped = true;
        }
      }
    }
    
    // move command
    controller.sharedInvokement( "moveUnit", [ moveDto.clone(), sourceDto.unitId, sourceDto.x, sourceDto.y ]);
  }
  
  // action command
  if( !trapped ) actionObject.invoke( scope );
  else controller.sharedInvokement( "trapWait", [ sourceDto.unitId ]);
  
  // all unit actions invokes automatically waiting
  if( actionObject.unitAction && actionDto.selectedEntry !== "wait" ){
    controller.sharedInvokement( "markUnitNonActable", [ sourceDto.unitId ]);
  }
  
  return trapped;
};
