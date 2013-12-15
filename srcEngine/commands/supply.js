controller.action_unitAction({

  key:"supplyUnit",

  relation: [
    "S","T",
    model.player_RELATION_MODES.NONE,
    model.player_RELATION_MODES.SAME_OBJECT
  ],

  condition: function( data ){
    return model.events.supplyUnit_check(
      data.source.unitId,
      data.target.x,
      data.target.y
    );
  },

  invoke: function( data ){
    controller.commandStack_sharedInvokement(
      "supplyUnit_invoked",
      data.source.unitId
    );
  }

});
