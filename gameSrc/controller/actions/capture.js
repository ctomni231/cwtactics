cwt.Action.unitAction({
  key:"capture",

  relation:[
    "S","T",
    cwt.Player.RELATION_SAMETHING,
    cwt.Player.RELATION_NONE
  ],

  relationToProp:[
    "S","T",
    cwt.Player.RELATION_ENEMY,
    cwt.Player.RELATION_NONE
  ],

  condition: function( data  ){
    return model.events.capture_check(

      data.target.propertyId,
      data.source.unitId
    );
  },

  invoke: function( data ){
    controller.commandStack_sharedInvokement(
      "capture_invoked",
      data.target.propertyId,
      data.source.unitId
    );
  }
});
