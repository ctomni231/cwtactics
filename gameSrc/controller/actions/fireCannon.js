controller.action_unitAction({

  key:"fireCannon",

  relation:[
    "S","T",
    model.player_RELATION_MODES.SAME_OBJECT
  ],

  condition: function( data ){
    return model.events.fireCannon_check(data.source.unitId,data.selection);
  },

  targetSelectionType: "A",
  prepareTargets: function( data ){
    model.events.fireCannon_fillTargets(data.source.unitId,data.selection);
  },

  invoke: function( data ){
    controller.commandStack_sharedInvokement(
      "fireCannon_invoked",
      data.target.x,
      data.target.y,
      data.targetselection.x,
      data.targetselection.y
    );
  }

});
