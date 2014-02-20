cwt.Action.unitAction({
  key:"transferUnit",

  relation: [
    "S","T",
    cwt.Relationship.RELATION_SAMETHING
  ],

  condition: function( data ){
    return model.events.transferUnit_check(data.source.unitId);
  },

  hasSubMenu: true,
  prepareMenu: function( data ){
    model.events.transferUnit_addEntries(data.source.unit.owner, data.menu);
  },

  invoke: function( data ){
    controller.commandStack_sharedInvokement(
      "transferUnit_invoked",
      data.source.unitId,
      data.action.selectedSubEntry
    );
  }

});
