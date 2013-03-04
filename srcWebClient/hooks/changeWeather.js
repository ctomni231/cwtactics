view.registerCommandHook({

  key: "CWTH",

  prepare: function( wth ){
    view.showInfoMessage( util.i18n_localized("weatherChange")+" "+util.i18n_localized( wth ) );
  },

  render: function(){},
  update: function(){},

  isDone: function(){
    return !view.hasInfoMessage();
  }

});