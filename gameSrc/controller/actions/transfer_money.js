controller.action_mapAction({

  key:"transferMoney",

  condition: function( data ){
    return model.events.transferMoney_check(

      model.round_turnOwner,
      data.target.x,
      data.target.y
    );
  },

  hasSubMenu: true,
  prepareMenu: function( data ){
    model.events.transferMoney_addEntries( model.round_turnOwner, data.menu );
  },

  invoke: function( data ){
    controller.commandStack_sharedInvokement(
      "transferMoney_invoked",
      model.round_turnOwner,
      ( data.target.unit )? data.target.unit.owner : data.target.property.owner,
      data.action.selectedSubEntry
    );
  }

});
