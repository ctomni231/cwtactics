controller.action_unitAction({

  key:"unitUnhide",

  relation: [
    "S","T",
    model.player_RELATION_MODES.NONE,
    model.player_RELATION_MODES.SAME_OBJECT
  ],

  condition: function( data ){
    return model.events.unitUnhide_check(

      data.source.unitId
    );
  },

  invoke: function( data ){
    controller.commandStack_sharedInvokement(
      "unitUnhide_invoked",
      data.source.unitId
    );
  }

});
