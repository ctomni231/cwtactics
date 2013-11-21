view.registerAnimationHook({
  key: "round_nextTurn",
  
  prepare: function(){
    //controller.audio_playMusicForPlayer(model.round_turnOwner);
    view.showInfoMessage(
      model.data_localized("day")+
        " "+
      model.round_day+
        " - "+
      model.player_data[model.round_turnOwner].name
    );
  },
  
  render: function(){},
  
  update: function( delta ){},
  
  isDone: function(){
    return !view.hasInfoMessage();
  }
  
});
