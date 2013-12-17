(function(){

  function setTarget( x,y, data ){
    data.targetselection.set(x,y);
  }

  //
  //
  controller.ai_defineRoutine({
    key        : "attackDirect",
    unitAction : true,

    scoring : function( data , cScore ){
      if( cScore >= 5 ) return -1;
      
      var x,y,ye,xe;
      var tx,ty;
      var found = false;
      var dataL = data.selection.data;
      for (x = 0, xe = dataL.length; x<xe; x++ ) {
        for (y = 0, ye = dataL[x].length; y<ye; y++ ) {
          if( dataL[x][y] >= 0 ){

            if( model.unit_posData[x][y]) continue;

            // check
            if( model.events.attack_check( data.source.unitId, x,y, true) ){
              tx = x;
              ty = y;
              found = true;
              break;
            }

          }
        };
        if( found ) break;
      };

      if(!found) return -1;

      // grab path
      model.move_generatePath( 
        data.source.x, data.source.y, 
        tx, ty, 
        data.selection, 
        data.move 
      );

      // attack map
      model.battle_calculateTargets( data.source.unitId, tx, ty, data.selection, false );
      data.selection.nextValidPosition( 
          tx, ty, 
          0, ( Math.random()<0.5 )? true: false, 
          setTarget,
          data
        );

      if( data.targetselection.unitId === -1 ) return -1;

      return 5;
    },

    prepare : function( data ){

      // move command
      if( data.move[0] !== INACTIVE_ID ){

        controller.commandStack_sharedInvokement("move_clearWayCache");

        for( var i = 0, e = data.move.length; i < e; i+=6 ){
          if( data.move[i] === INACTIVE_ID ) break;
          controller.commandStack_sharedInvokement(
            "move_appendToWayCache",
            data.move[i  ],
            data.move[i+1],
            data.move[i+2],
            data.move[i+3],
            data.move[i+4],
            data.move[i+5]
          );
        }

        controller.commandStack_sharedInvokement(
          "move_moveByCache",
          data.source.unitId,
          data.source.x,
          data.source.y,
          0
        );

      }

      // attack
      controller.commandStack_sharedInvokement(
        "attack_invoked",
        data.source.unitId, 
        data.targetselection.unitId, 
        Math.round( Math.random()*100 ),
        Math.round( Math.random()*100 ),
        0
      );

      controller.commandStack_sharedInvokement(
        "wait_invoked",
        data.source.unitId
      );
    }
  });
})();