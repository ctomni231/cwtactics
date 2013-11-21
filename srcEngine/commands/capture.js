controller.action_unitAction({
  
  key:"capture",
  
	relation:["S","T",model.player_RELATION_MODES.SAME_OBJECT, model.player_RELATION_MODES.NONE],
	relationToProp:["S","T",model.player_RELATION_MODES.ENEMY, model.player_RELATION_MODES.NONE],
	
  condition: function( data ){
		return model.property_isCapturableBy( data.target.propertyId, data.source.unitId );
  },
  
  invoke: function( data ){
    controller.action_sharedInvoke("property_capture",[ 
			data.source.unitId, 
			data.target.propertyId 
		]);
  }
  
});