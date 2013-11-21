controller.action_unitAction({
  
  key:"wait",
  
	relation: ["S","T",model.player_RELATION_MODES.NONE,model.player_RELATION_MODES.SAME_OBJECT],
  
  invoke: function( data ){
    controller.action_sharedInvoke("actions_markUnitNonActable",[data.source.unitId]);
  }
  
});