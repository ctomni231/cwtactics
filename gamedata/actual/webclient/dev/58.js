controller.unitAction({
  
  key:"supplyUnit",
	
	relation: ["S","T",model.relationModes.NONE,model.relationModes.SAME_OBJECT],
  
  condition: function( data ){
		return model.hasSupplyTargetsNearby( data.source.unitId, data.target.x, data.target.y );
  },
  
  invoke: function( data ){
    controller.sharedInvokement( "unitSuppliesNeighbours",[ 
			data.source.unitId 
		]);
  }
  
});