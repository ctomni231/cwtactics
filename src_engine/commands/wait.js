controller.action_unitAction({

  key:"wait",
  noAutoWait: true,

  relation: [
    "S","T",
    model.player_RELATION_MODES.NONE,
    model.player_RELATION_MODES.SAME_OBJECT
  ],

  condition: function( data ){
    return model.events.wait_check( data.source.unitId);
  },

  invoke: function( data ){
    controller.commandStack_sharedInvokement(
      "wait_invoked",
      data.source.unitId
    );
  }

});
