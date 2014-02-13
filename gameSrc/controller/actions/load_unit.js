cwt.Action.unitAction({
  key:"loadUnit",

  relation: [
    "S","T",
    cwt.Player.RELATION_OWN
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
