controller.action_unitAction({

  key:"detachCommander",

  condition: function(data){
    return model.events.detachCommander_check(

      model.round_turnOwner
    );
  },

  invoke: function( data ){
    controller.commandStack_sharedInvokement(
      "detachCommander_invoked",
      model.round_turnOwner,
      data.target.x,
      data.target.y
    );
  }

});
