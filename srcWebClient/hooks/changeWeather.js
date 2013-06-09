view.registerAnimationHook({

  key: "changeWeather",

  prepare: function( wth ){
    view.showInfoMessage( model.localized("weatherChange")+" "+model.localized( wth ) );
  },

  render: function(){},
  update: function(){},

  isDone: function(){
    return !view.hasInfoMessage();
  }

});
