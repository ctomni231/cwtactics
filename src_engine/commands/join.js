controller.action_unitAction({

  key:"joinUnits",
  noAutoWait: true,

  relation:[
    "S","T",
    model.player_RELATION_MODES.OWN
  ],

  condition: function( data ){
    return model.events.joinUnits_check(data.source.unitId, data.target.unitId);
  },

  invoke: function( data ){
    controller.commandStack_sharedInvokement(
      "joinUnits_invoked",
      data.source.unitId,
      data.target.unitId
    );

    // set target unit into wait mode
    controller.commandStack_sharedInvokement(
      "wait_invoked",
      data.target.unitId
    );
  }

});
