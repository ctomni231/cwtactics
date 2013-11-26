controller.action_unitAction({
  
  key:"explode",
	
	relation: ["S","T",model.player_RELATION_MODES.NONE,model.player_RELATION_MODES.SAME_OBJECT],
  
  condition: function( data ){
    return model.bombs_isSuicideUnit( data.source.unitId );
  },
  
  invoke: function( data ){
    controller.action_sharedInvoke("unit_destroySilently",[
      data.source.unitId 
    ]);
    
    controller.action_sharedInvoke("bombs_explosionAt",[ 
      data.target.x,
      data.target.y,
      data.source.unit.type.suicide.range,
      model.unit_convertPointsToHealth(data.source.unit.type.suicide.damage),
      data.source.unit.owner
    ]);
  }
  
});
