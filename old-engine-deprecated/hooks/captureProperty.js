view.registerAnimationHook({

  key: "property_capture",

  prepare: function( cid, prid ){
    var property = model.property_data[ prid ];
    controller.updateUnitStatus( cid );

    if( property.capturePoints === 20 ){
      view.showInfoMessage( model.data_localized("propertyCaptured") );
    }
    else view.showInfoMessage( model.data_localized("propertyPointsLeft")+" "+property.capturePoints );
  },

  render: function(){},
  update: function(){},

  isDone: function(){
    return !view.hasInfoMessage();
  }

});
