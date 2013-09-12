controller.propertyAction({
  
  key:"buildUnit",  
  propertyAction: true,
  hasSubMenu: true,
  
  condition: function( data ){
    return model.propertyCanBuild( data.source.propertyId );
  },
  
  prepareMenu: function( data ){
    model.getBuildMenu( data.source.propertyId, data.menu );
  },
  
  invoke: function( data ){
    controller.sharedInvokement("buildUnit", [ 
			data.source.x, 
			data.source.y, 
			data.action.selectedSubEntry 
		]);
  }
  
});