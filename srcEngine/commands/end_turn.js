controller.mapAction({
  
  key:"nextTurn",
  
  condition: function( data ){
    return true;
  },
  
  invoke: function(){
    controller.sharedInvokement("nextTurn",[]);
  }
  
});