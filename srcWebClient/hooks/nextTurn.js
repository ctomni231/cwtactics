controller.playSoundForPlayer = function( pid ){
  var co = model.players[pid].mainCo;
  
  if( Browser.ios ){
    
    // PLAY FACTION SOUND
    controller.playMusic( model.factionTypes[co.faction].music );
  }
  else{ 
    
    // PLAY CO SOUND
    controller.playMusic( co.music );
  }
};

view.registerAnimationHook({
  key: "nextTurn",
  
  prepare: function(){
    controller.renderPlayerInfo();
    
    controller.playSoundForPlayer( model.turnOwner );
    
    view.showInfoMessage( model.localized("day")+" "+model.day );
  },
  
  render: function(){},
  
  update: function( delta ){},
  
  isDone: function(){
    return !view.hasInfoMessage();
  }
  
});
