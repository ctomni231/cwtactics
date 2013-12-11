controller.action_unitAction({
  
  key:"joinUnits",
  
	relation:["S","T",model.player_RELATION_MODES.OWN],
	
  condition: function( data ){
    return model.unit_areJoinable( data.source.unitId, data.target.unitId );
  },
  
  invoke: function( data ){
    controller.action_sharedInvoke("unit_join",[ 
			data.source.unitId, 
			data.target.unitId 
		]);
    controller.action_sharedInvoke("actions_markUnitNonActable",[
      data.target.unitId
    ]);
  }
  
});