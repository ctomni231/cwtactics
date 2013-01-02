view.registerCommandHook({

  key: "endGame",

  prepare: function( data ){
    view.showInfoMessage( util.i18n_localized("gameHasEnded"), 1000*60*60 );
  },

  render: function(){},
  update: function(){},

  isDone: function(){
    return false; // HACKY STOP FOR THE MILESTONES:P
  }

});