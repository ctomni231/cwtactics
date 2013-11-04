controller.action_unitAction({
	
	key:"unloadUnit",
	multiStepAction: true,
	relation:[ "S","T", model.player_RELATION_MODES.SAME_OBJECT, model.player_RELATION_MODES.NONE],
	
	condition: function( data ){
		return model.transport_canUnloadUnitsAt( 
			data.source.unitId, 
			data.target.x, 
			data.target.y 
		);
	},
	
	prepareMenu: function( data ){
		model.transport_addUnloadTargetsToMenu( 
			data.source.unitId, 
			data.target.x, 
			data.target.y, 
			data.menu 
		);
	},
	
	targetSelectionType: "B",
	prepareTargets: function( data ){
		model.transport_addUnloadTargetsToSelection( 
			data.source.unitId, 
			data.target.x, 
			data.target.y,
			data.action.selectedSubEntry, 
			data.selection 
		);
	},
	
	invoke: function( data ){
		controller.action_sharedInvoke( "transport_unloadFrom",[
			data.source.unitId, 
			data.target.x, 
			data.target.y, 
			data.action.selectedSubEntry, 
			data.targetselection.x, 
			data.targetselection.y,
			true
		]);
	}
	
});