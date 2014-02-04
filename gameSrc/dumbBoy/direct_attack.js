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

      if( !data.source.unit.type.attack ) return -1;
      
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
      data.selection.nextRandomPosition( setTarget, data, 1 );

      if( data.targetselection.unitId === -1 ) return -1;

      return 5;
    },

    prepare : function( data ){

      var trapped = false;
      if (data.move[0] !== -1) {
        trapped = model.move_trapCheck(data.move, data.source, data.target);
        model.events.move_flushMoveData(data.move, data.source);
      }

      if (!trapped){
        controller.commandStack_sharedInvokement(
          "attack_invoked",
          data.source.unitId,
          data.targetselection.unitId,
          Math.round(Math.random() * 100),
          Math.round(Math.random() * 100),
          0
        );
        controller.commandStack_sharedInvokement(
          "wait_invoked",
          data.source.unitId
        );
      } else {
        controller.commandStack_sharedInvokement(
          "trapwait_invoked",
          data.source.unitId
        );
      }
    }
  });
})();