view.registerCommandHook({

  key: "CTPR",

  prepare: function( cid, prid, px,py, points ){
    var property = model.properties[ prid ];

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