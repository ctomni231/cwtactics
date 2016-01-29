controller.action_clientAction({

  key:"options",  

  condition: function(){
    return true;
  },

  invoke: function(){
    controller.screenStateMachine.event("toOptions_",true);
  }
  
});