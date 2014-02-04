controller.action_mapAction({

  key:"activatePower",

  condition: function(data){
    return model.events.activatePower_check(
      model.round_turnOwner
    );
  },

  hasSubMenu: true,
  prepareMenu: function( data ){
    var co_data = model.co_data[ model.round_turnOwner ];

    data.menu.addEntry("cop");
    if( model.co_canActivatePower( model.round_turnOwner, model.co_POWER_LEVEL.SCOP ) ){
      data.menu.addEntry("scop");
    }
  },

  invoke: function( data ){
    var cmd;
    switch ( data.action.selectedSubEntry ){
      case "cop"  : cmd = model.co_POWER_LEVEL.COP; break;
      case "scop" : cmd = model.co_POWER_LEVEL.SCOP; break;
      default: assert(false);
    }

    controller.commandStack_sharedInvokement(
      "activatePower_invoked", model.round_turnOwner, cmd
    );
  }
});
