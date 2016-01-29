controller.action_propertyAction({

  key:"buildUnit",

  condition: function( data ){
    return model.events.buildUnit_check(
      data.source.propertyId,
      model.property_data[data.source.propertyId].owner
    );
  },

  hasSubMenu: true,
  prepareMenu: function( data ){
    model.factoryGenerateBuildMenu(
      data.source.propertyId,
      data.menu,
      true
    );
  },

  invoke: function( data ){
    controller.commandStack_sharedInvokement(
      "buildUnit_invoked",
      data.source.x,
      data.source.y,
      data.action.selectedSubEntry
    );
  }

});
