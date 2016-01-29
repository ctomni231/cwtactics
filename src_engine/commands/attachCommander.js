controller.action_unitAction({

  key:"attachCommander",

  condition: function(data){
    return model.events.attachCommander_check(

      model.round_turnOwner
    );
  },

  invoke: function( data ){
    controller.commandStack_sharedInvokement(
      "co_attachCommander",
      model.round_turnOwner,
      data.source.unitId
    );
  }

});
