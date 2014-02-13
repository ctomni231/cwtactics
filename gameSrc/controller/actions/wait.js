cwt.Action.unitAction({
  key:"wait",

  relation:[
    "S","T",
    model.player_RELATION_MODES.SAME_OBJECT,
    model.player_RELATION_MODES.NONE
  ],

  condition: function( data ){
    return cwt.Gameround.canAct(data.source.unit);
  },

  invoke: function( data ){
    controller.commandStack_sharedInvokement(
      "wait_invoked",
      data.source.unitId
    );
  }
});