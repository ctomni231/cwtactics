// Builds several commands from collected action data.
//
controller.actionBuilder_buildFromUserData = function(){
  var scope         = controller.stateMachine.data;
  var targetDto     = scope.target;
  var sourceDto     = scope.source;
  var moveDto       = scope.movePath;
  var actionDto     = scope.action;
  var actionObject  = actionDto.object;
  var trapped       = false;
  
  // generate move path -> check traps
  if( moveDto.data[0] !== -1 ){

    assert( sourceDto.unitId !== INACTIVE_ID );

    var way = moveDto.data;
    var cx  = sourceDto.x;
    var cy  = sourceDto.y;

    for( var i=0,e=way.length; i<e; i++ ){
      
      // end of way
      if( way[i] === -1 ) break;

      switch( way[i] ){
        case model.move_MOVE_CODES.DOWN  : cy++; break;
        case model.move_MOVE_CODES.UP    : cy--; break;
        case model.move_MOVE_CODES.LEFT  : cx--; break;
        case model.move_MOVE_CODES.RIGHT : cx++; break;
      }

      var unit = model.unit_posData[cx][cy];
      if( unit !== null ){
        
        if( model.player_data[model.round_turnOwner].team !==
            model.player_data[unit.owner].team ){
          
          // convert to `actions_trapWait`
          targetDto.set(cx,cy);
          way.splice( i );
          trapped = true;
        }
      }
    }
    
    // move command
    controller.action_sharedInvoke( "move_moveUnitByPath", [
      moveDto.clone(),
      sourceDto.unitId,
      sourceDto.x,
      sourceDto.y
    ]);
  }
  
  // action command
  if( !trapped ) actionObject.invoke( scope );
  else controller.action_sharedInvoke( "actions_trapWait", [ sourceDto.unitId ]);
  
  // all unit actions invokes automatically waiting
  if( actionObject.unitAction && actionDto.selectedEntry !== "wait" ){
    controller.action_sharedInvoke( "actions_markUnitNonActable", [ sourceDto.unitId ]);
  }
  
  return trapped;
};