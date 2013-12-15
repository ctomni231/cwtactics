controller.action_mapAction({

  key:"nextTurn",

  condition: function(data){
    return model.events.nextTurn_check(wish);
  },

  invoke: function(){
    controller.commandStack_sharedInvokement("nextTurn_invoked");
  }

});
