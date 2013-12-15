controller.action_unitAction({

  key:"capture",

  relation      :[
    "S","T",
    model.player_RELATION_MODES.SAME_OBJECT,
    model.player_RELATION_MODES.NONE
  ],

  relationToProp:[
    "S","T",
    model.player_RELATION_MODES.ENEMY,
    model.player_RELATION_MODES.NONE
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
