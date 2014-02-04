controller.action_unitAction({

  key:"attack",

  relation:[
    "S", "T",
    model.player_RELATION_MODES.NONE,
    model.player_RELATION_MODES.SAME_OBJECT
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
