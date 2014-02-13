cwt.Action.unitAction({
  key:"attack",

  relation:[
    "S", "T",
    cwt.Player.RELATION_NONE,
    cwt.Player.RELATION_SAMETHING
  ],

  targetSelectionType:"A",
  prepareTargets: function( data ){
    model.battle_calculateTargets(
      data.source.unitId,
      data.target.x,
      data.target.y,
      data.selection
    );
  },

  condition: function( data ){
    return model.events.attack_check(

      data.source.unitId,
      data.target.x,
      data.target.y,
      data.movePath.data[0] !== INACTIVE_ID
    );
  },

  invoke: function( data ){
    if( data.targetselection.unitId !== -1 ){
      controller.commandStack_sharedInvokement(
        "attack_invoked",
        data.source.unitId,
        data.targetselection.unitId,
        Math.round( Math.random()*100 ),
        Math.round( Math.random()*100 ),
        0
      );
    }
    else assert(false,"no valid target");
  }
});
