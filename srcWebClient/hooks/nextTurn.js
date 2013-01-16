view.registerCommandHook({

  key: "nextTurn",

  prepare: function( data ){
    if( model.fogOn ){
      view.completeRedraw();
    }

    view.showInfoMessage( util.i18n_localized("day")+": "+model.day );
  },

  render: function(){},
  update: function(){},

  isDone: function(){
    return !view.hasInfoMessage();
  }

});