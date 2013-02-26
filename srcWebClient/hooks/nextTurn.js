view.registerCommandHook({

  key: "NXTR",

  prepare: function(  ){
    if( model.rules.fogEnabled ){
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