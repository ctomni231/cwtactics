controller.action_propertyAction({
  
  key:"buildUnit",
  propertyAction: true,
  hasSubMenu: true,
  
  condition: function( data ){
    return model.factory_canProduceSomething( data.source.propertyId );
  },
  
  prepareMenu: function( data ){
    model.factoryGenerateBuildMenu( data.source.propertyId, data.menu );
  },
  
  invoke: function( data ){
    controller.action_sharedInvoke("factory_produceUnit", [ 
			data.source.x, 
			data.source.y, 
			data.action.selectedSubEntry 
		]);
  }
  
});