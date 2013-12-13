controller.action_propertyAction({
  
  key:"buildUnit",
  propertyAction: true,
  hasSubMenu: true,
  
  condition: function( data, wish ){
    model.events["buildUnit_check"]( 
      wish, 
      data.source.propertyId, 
      model.property_data[data.source.propertyId].owner
    );

    return !wish.declined;
  },
  
  prepareMenu: function( data ){
    model.factoryGenerateBuildMenu( data.source.propertyId, data.menu, true );
  },
  
  invoke: function( data ){
    controller.action_sharedInvoke("factory_produceUnit", [ 
			data.source.x, 
			data.source.y, 
			data.action.selectedSubEntry 
		]);
  }
  
});