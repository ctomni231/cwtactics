controller.action_unitAction({
  
  key:"ununit_hide",
  
	relation: ["S","T",model.player_RELATION_MODES.NONE,model.player_RELATION_MODES.SAME_OBJECT],
  
  condition: function( data ){
    return data.source.unit.hidden;
  },
  
  invoke: function( data ){
    controller.action_sharedInvoke("unit_unhide",[
			data.source.unitId 
		]);
  }
  
});