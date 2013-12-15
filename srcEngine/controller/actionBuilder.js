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

          targetDto.set(cx,cy);
          way[i]  = INACTIVE_ID;
          trapped = true;
        }
      }
    }

    // move command
    controller.commandStack_sharedInvokement("move_clearWayCache");

    for( var i = 0, e = moveDto.data.length; i < e; i+=6 ){
      if( moveDto.data[i  ] === INACTIVE_ID ) break;
      controller.commandStack_sharedInvokement(
        "move_appendToWayCache",
        moveDto.data[i  ],
        moveDto.data[i+1],
        moveDto.data[i+2],
        moveDto.data[i+3],
        moveDto.data[i+4],
        moveDto.data[i+5]
      );
    }

    controller.commandStack_sharedInvokement(
      "move_moveByCache",
      sourceDto.unitId,
      sourceDto.x,
      sourceDto.y,
      0
    );
  }

  // action command
  if( !trapped )  actionObject.invoke( scope );
  else controller.action_sharedInvoke( "trapwait_invoked", [ sourceDto.unitId ]);

  // all unit actions invokes automatically waiting
  if( trapped || actionObject.unitAction && !actionObject.noAutoWait ){
    controller.commandStack_sharedInvokement(
      "wait_invoked",
      sourceDto.unitId
    );
  }

  return trapped;
};
