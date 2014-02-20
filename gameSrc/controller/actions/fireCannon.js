cwt.Action.unitAction({
  key:"fireCannon",

  relation:[
    "S","T",
    cwt.Player.RELATION_SAMETHING
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
