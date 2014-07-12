cwt.Action.unitAction({
  key:"unitHide",

  relation: [
    "S","T",
    cwt.Relationship.RELATION_NONE,
    cwt.Relationship.RELATION_SAME_THING
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
