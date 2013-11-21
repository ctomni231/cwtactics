view.registerAnimationHook({
  key: "nextTurn",
  
  prepare: function(){
    controller.audio_playMusicForPlayer(model.round_turnOwner);
    .showInfoMessage( model.data_localized("day")+" "+model.round_day+" - "+model.player_data[model.round_turnOwner].name );
  },
  
  render: function(){},
  
  update: function( delta ){},
  
  isDone: function(){
    return !.hasInfoMessage();
  }
  
});
