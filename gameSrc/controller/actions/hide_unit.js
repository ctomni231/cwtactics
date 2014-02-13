cwt.Action.unitAction({
  key:"unitHide",

  relation: [
    "S","T",
    cwt.Player.RELATION_NONE,
    cwt.Player.RELATION_SAMETHING
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
