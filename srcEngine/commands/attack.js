controller.action_unitAction({
  
  key:"attack",
  targetSelectionType:"A",
	
	relation:[ "S", "T", model.player_RELATION_MODES.NONE, model.player_RELATION_MODES.SAME_OBJECT ],
  
  prepareTargets: function( data ){
    model.battle_calculateTargets( data.source.unitId, data.target.x, data.target.y, data.selection );
  },
  
  condition: function( data ){
		if( model.battle_isPeacePhaseActive() ) return false;
		if( model.battle_isIndirectUnit(data.source.unitId) && data.movePath.data.getSize() > 0 ) return false;
    return model.battle_hasTargets( data.source.unitId, data.target.x, data.target.y );
  },
          
  invoke: function( data ){
    if( data.targetselection.unitId !== -1 ){
      controller.action_sharedInvoke("battle_invokeBattle",[
        data.source.unitId,
        data.targetselection.unitId,
        Math.round( Math.random()*100 ),
        Math.round( Math.random()*100 ),
        false
      ]);
    }
    else assert(false,"no valid target");
  }
});
