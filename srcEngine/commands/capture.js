controller.unitAction({
  
  key:"capture",
  
	relation:["S","T",model.relationModes.SAME_OBJECT, model.relationModes.NONE],
	relationToProp:["S","T",model.relationModes.ENEMY, model.relationModes.NONE],
	
  condition: function( data ){
		return model.propertyIsCapturableBy( data.target.propertyId, data.source.unitId );
  },
  
  invoke: function( data ){
    controller.sharedInvokement("captureProperty",[ 
			data.source.unitId, 
			data.target.propertyId 
		]);
  }
  
});