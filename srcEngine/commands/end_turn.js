controller.action_mapAction({
  
  key:"nextTurn",
  
  condition: function(){
    return true;
  },
  
  invoke: function(){
    controller.action_sharedInvoke("nextTurn",[]);
  }
  
});