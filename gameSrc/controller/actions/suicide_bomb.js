cwt.Player.unitAction({
  key:"explode",
  noAutoWait: true,

  relation: [
    "S","T",
    cwt.Player.RELATION_NONE,
    cwt.Player.RELATION_SAMETHING
  ],

  condition: function( data ){
    return model.events.explode_check(data.source.unitId);
  },

  invoke: function( data ){
    controller.commandStack_sharedInvokement("unit_destroySilently",data.source.unitId);
    controller.commandStack_sharedInvokement(
      "explode_invoked",
      data.target.x,
      data.target.y,
      data.source.unit.type.suicide.range,
      model.unit_convertPointsToHealth(data.source.unit.type.suicide.damage),
      data.source.unit.owner
    );
  }
});
