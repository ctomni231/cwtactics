view.registerAnimationHook({
  key: "nextTurn",
  
  prepare: function(){
    controller.playMusicForPlayer(model.turnOwner);
    .showInfoMessage( model.localized("day")+" "+model.day+" - "+model.players[model.turnOwner].name );
  },
  
  render: function(){},
  
  update: function( delta ){},
  
  isDone: function(){
    return !.hasInfoMessage();
  }
  
});
