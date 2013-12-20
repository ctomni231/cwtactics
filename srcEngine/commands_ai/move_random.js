(function(){

  function setTarget( x,y, data ){
    data.target.set(x,y);
  }

  //
  //
  controller.ai_defineRoutine({
    key        : "moveRandom",
    unitAction : true,

    scoring : function( data , cScore ){
      if( cScore >= 1 ) return -1;

      var n = 0;
      while( true ){
        data.selection.nextRandomPosition( setTarget, data, 0 );
        if( data.target.x >= 0 && data.target.y >= 0 && !data.target.unit ) break;
        n++;
        if( n === 10 ) return -1;
      }
            
      model.move_generatePath( 
        data.source.x, data.source.y, 
        data.target.x, data.target.y, 
        data.selection, 
        data.move 
      );

      var way = data.move;
      var cx  = data.source.x;
      var cy  = data.source.y;
      var cBx;
      var cBy;
      var trapped = false;
      for( var i=0,e=way.length; i<e; i++ ){

        // end of way
        if( way[i] === -1 ) break;

        cBx = cx;
        cBy = cy;
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

            data.target.set(cBx,cBy);
            way[i]  = INACTIVE_ID;
            trapped = true;
            break;
          }
        }
      }

      return 1;
    },

    prepare : function( data ){

      // move command
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

      controller.commandStack_sharedInvokement(
        "wait_invoked",
        data.source.unitId
      );
    }
  });
})();