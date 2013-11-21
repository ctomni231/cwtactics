controller.action_unitAction({
  
  key:"supplyUnit",
	
	relation: ["S","T",model.player_RELATION_MODES.NONE,model.player_RELATION_MODES.SAME_OBJECT],
  
  condition: function( data ){
		return model.supply_hasSupplyTargetsNearby( data.source.unitId, data.target.x, data.target.y );
  },
  
  invoke: function( data ){
    controller.action_sharedInvoke( "supply_suppliesNeighbours",[ 
			data.source.unitId 
		]);
  }
  
});