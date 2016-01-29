controller.action_unitAction({

  key:"unitHide",

  relation: [
    "S","T",
    model.player_RELATION_MODES.NONE,
    model.player_RELATION_MODES.SAME_OBJECT
  ],

  condition: function( data ){
    return model.events.unitHide_check(data.source.unitId);
  },

  invoke: function( data ){
    controller.commandStack_sharedInvokement(
      "unitHide_invoked",
      data.source.unitId
    );
  }

});
