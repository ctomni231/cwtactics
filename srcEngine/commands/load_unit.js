controller.action_unitAction({
  
  key:"loadUnit",
  
	relation: ["S","T",model.player_RELATION_MODES.OWN],
	
  condition: function( data ){
    var tuid = data.target.unitId;
    return model.transport_isTransportUnit( tuid ) && model.transport_canLoadUnit( data.source.unitId, tuid );
  },
  
  invoke: function( data ){
    controller.action_sharedInvoke( "transport_loadInto",[ 
			data.source.unitId, 
			data.target.unitId 
		]);
  }
 
});