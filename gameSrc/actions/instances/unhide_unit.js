cwt.Action.unitAction({
  key:"unitUnhide",

  relation: [
    "S","T",
    cwt.Relationship.RELATION_NONE,
    cwt.Relationship.RELATION_SAME_THING
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
