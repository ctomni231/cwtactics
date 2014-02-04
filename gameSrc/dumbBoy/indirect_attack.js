(function(){

  function setTarget( x,y, data ){
    data.targetselection.set(x,y);
  }

  //
  //
  controller.ai_defineRoutine({
    key        : "attackFromCurrentPos",
    unitAction : true,

    scoring : function( data , cScore ){
      if( cScore >= 10 ) return -1;

      if( !data.source.unit.type.attack ) return -1;

      if( !model.events.attack_check( 
        data.source.unitId, 
        data.source.x,
        data.source.y, 
        false
      )) return -1;

      // attack map
      model.battle_calculateTargets( 
        data.source.unitId, 
        data.source.x,
        data.source.y, 
        data.selection, 
        false 
      );

      data.selection.nextRandomPosition( setTarget, data, 1 );

      if( data.targetselection.unitId === -1 ) return -1;

      return 10;
    },

    prepare : function( data ){

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