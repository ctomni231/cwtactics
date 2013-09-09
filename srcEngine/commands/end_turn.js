controller.mapAction({
  
  key:"nextTurn",
  
  condition: function(){
    return true;
  },
  
  invoke: function(){
    controller.sharedInvokement("nextTurn",[]);
  }
  
});