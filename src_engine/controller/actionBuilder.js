// Builds several commands from collected action data.
//
controller.actionBuilder_buildFromUserData = function( scope ){
  if( !scope ) scope = controller.stateMachine.data;
  var targetDto      = scope.target;
  var sourceDto      = scope.source;
  var actionDto      = scope.action;
  var moveDto        = scope.movePath;
  var actionObject   = actionDto.object;

  var trapped        = false;
  if( moveDto.data[0] !== -1 ){
    trapped = model.move_trapCheck(moveDto.data,sourceDto,targetDto);
    model.events.move_flushMoveData(moveDto.data,sourceDto);
  }

  if( !trapped )  actionObject.invoke( scope );
  else controller.commandStack_sharedInvokement( 
    "trapwait_invoked", 
    sourceDto.unitId 
  );

  // all unit actions invokes automatically waiting
  if( trapped || actionObject.unitAction && !actionObject.noAutoWait ){
    controller.commandStack_sharedInvokement(
      "wait_invoked",
      sourceDto.unitId
    );
  }

  return trapped;
};