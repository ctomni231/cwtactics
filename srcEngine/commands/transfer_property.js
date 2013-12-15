controller.action_propertyAction({

  key:"transferProperty",

  relationToProp:[
    "S","T",
    model.player_RELATION_MODES.SAME_OBJECT
  ],

  condition: function( data  ){
    return model.events.transferProperty_check(data.source.propertyId);
  },

  hasSubMenu: true,
  prepareMenu: function( data ){
    model.events.transferProperty_addEntries(data.source.property.owner, data.menu);
  },

  invoke: function( data ){
    controller.commandStack_sharedInvokement(
      "transferProperty_invoked",
      data.source.propertyId,
      data.action.selectedSubEntry
    );
  }
});
