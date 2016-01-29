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
        if( n >= 10 ) return -1;

        if( !data.selection.nextRandomPosition( setTarget, data, 0 ) ){
          n++;
          continue;  
        }

        if( !data.target.unit ) break;
        else n++;
      }
            
      model.move_generatePath( 
        data.source.x, data.source.y, 
        data.target.x, data.target.y, 
        data.selection, 
        data.move 
      );

      model.move_trapCheck(data.move,data.source,data.target);

      return 1;
    },

    prepare : function( data ){

      model.events.move_flushMoveData( 
        data.move, 
        data.source 
      );
      
      controller.commandStack_sharedInvokement(
        "wait_invoked",
        data.source.unitId
      );
    }
  });
})();