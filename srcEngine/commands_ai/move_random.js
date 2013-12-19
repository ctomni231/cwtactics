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

      /*
      var range = data.source.unit.type.range;

      var rX =  data.source.x - range + parseInt((Math.random()*(range*2)),10)
      var rY =  data.source.y - range + parseInt((Math.random()*(range*2)),10)
      
      if( rX < 0 ) rX = 0;
      if( rY < 0 ) rY = 0;
      if( rX >= model.map_width  ) rX = model.map_width-1;
      if( rY >= model.map_height ) rY = model.map_height-1;

      var n = 0;
      while( true ){
        data.selection.nextValidPosition( 
          data.source.x, data.source.y, 
          0, ( Math.random()<0.5 )? true: false, 
          setTarget,
          data
        );

        if( data.target.x >= 0 && data.target.y >= 0 && !data.target.unit ) break;
        n++;
        if( n === 10 ) return -1;
      }
      */
      
      model.move_generatePath( 
        data.source.x, data.source.y, 
        data.target.x, data.target.y, 
        data.selection, 
        data.move 
      );

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