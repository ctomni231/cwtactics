util.scoped(function(){

  view.registerAnimationHook({
    key: "nextTurn_invoked",

    prepare: function(){
      
      view.showInfoMessage(
        model.data_localized("day")+
          " "+
          model.round_day+
          " - "+
          model.player_data[model.round_turnOwner].name,
        999999999
      );
      
      if( controller.features_client.audioMusic ){
        var co = model.co_data[model.round_turnOwner].coA;
        controller.coMusic_playCoMusic( ( co )? co.music : null );
      }
      else view.message_closePanel(1000);
    },

    render: function(){},

    update: function( delta ){},

    isDone: function(){
      return !view.hasInfoMessage();
    }

  });

});
