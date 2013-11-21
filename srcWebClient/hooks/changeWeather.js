view.registerAnimationHook({

  key: "weather_change",

  prepare: function( wth ){
    view.showInfoMessage( model.data_localized("weatherChange")+" "+model.data_localized( wth ) );
  },

  render: function(){},
  update: function(){},

  isDone: function(){
    return !view.hasInfoMessage();
  }

});
