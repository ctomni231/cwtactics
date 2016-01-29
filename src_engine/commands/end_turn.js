controller.action_mapAction({

  key:"nextTurn",

  condition: function(data){},

  invoke: function(){
    controller.commandStack_sharedInvokement("nextTurn_invoked");
  }

});
