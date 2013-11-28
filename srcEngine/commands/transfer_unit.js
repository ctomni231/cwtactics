controller.action_unitAction({
  
  key:"transferUnit",
  hasSubMenu: true,
	relation: ["S","T",model.player_RELATION_MODES.SAME_OBJECT],
  
  condition: function( data ){
    return model.team_isUnitTransferable( data.source.unitId );
  },
  
  prepareMenu: function( data ){
		model.team_addTransferTargets( data.source.unit.owner, data.menu );
  },
  
  invoke: function( data ){
    controller.action_sharedInvoke("team_transferUnit",[ 
			data.source.unitId, 
			data.action.selectedSubEntry 
		]);
  }
  
});