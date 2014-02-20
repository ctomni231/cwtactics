cwt.Action.unitAction({
  key:"unitUnhide",

  relation: [
    "S","T",
    cwt.Player.RELATION_NONE,
    cwt.Player.RELATION_SAMETHING
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
