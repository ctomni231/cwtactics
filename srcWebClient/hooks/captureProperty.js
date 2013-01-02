view.registerCommandHook({

  key: "captureProperty",

  prepare: function( data ){
    var property = data.getTargetProperty();

    if( property.capturePoints === 20 ){
      view.showInfoMessage( util.i18n_localized("propertyCaptured") );
    }
    else view.showInfoMessage(
      util.i18n_localized("propertyPointsLeft")+" "+property.capturePoints
    );
  },

  render: function(){},
  update: function(){},

  isDone: function(){
    return !view.hasInfoMessage();
  }

});