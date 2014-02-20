cwt.Action.unitAction({
  key:"supplyUnit",

  relation: [
    "S","T",
    cwt.Player.RELATION_NONE,
    cwt.Player.RELATION_SAMETHING
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
