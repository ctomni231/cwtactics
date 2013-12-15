controller.action_unitAction({

  key:"loadUnit",

  relation: [
    "S","T",
    model.player_RELATION_MODES.OWN
  ],

  condition: function( data ){
    return model.events.loadUnit_check(data.source.unitId,data.target.unitId);
  },

  invoke: function( data ){
    controller.commandStack_sharedInvokement(
      "loadUnit_invoked",
      data.source.unitId,
      data.target.unitId
    );
  }

});
