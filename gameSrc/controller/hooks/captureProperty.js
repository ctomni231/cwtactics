view.registerAnimationHook({

  key: "capture_invoked",

  prepare: function( prid, cid ){
    controller.updateUnitStatus( cid );
    
    var property = model.property_data[ prid ];
    if( model.fog_clientData[property.x][property.y] > 0 ){
      
      if( property.capturePoints === 20 ){
        view.showInfoMessage( 
          model.data_localized("propertyCaptured") 
        );
      } else {
        view.showInfoMessage( 
          model.data_localized("propertyPointsLeft")+" "+property.capturePoints 
        );
      }
    }
  },

  render: function(){},
  update: function(){},

  isDone: function(){
    return !view.hasInfoMessage();
  }

});