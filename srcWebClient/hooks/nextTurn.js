view.registerAnimationHook({
  key: "nextTurn",
  
  prepare: function(){
    controller.renderPlayerInfo();
    
    if( controller.clientFeatures.audioMusic ){
      controller.playMusic( 
        model.coData[model.turnOwner].coA.music 
      );
    }
    
    view.showInfoMessage( model.localized("day")+" "+model.day );
  },
  
  render: function(){},
  
  update: function( delta ){},
  
  isDone: function(){
    return !view.hasInfoMessage();
  }
  
});
