controller.unitAction({
	
	key:"unloadUnit",
	multiStepAction: true,
	relation:[ "S","T", model.relationModes.SAME_OBJECT, model.relationModes.NONE],
	
	condition: function( data ){
		return model.canUnloadUnitAt( 
			data.source.unitId, 
			data.target.x, 
			data.target.y 
		);
	},
	
	prepareMenu: function( data ){
		model.addUnloadTargetsToMenu( 
			data.source.unitId, 
			data.target.x, 
			data.target.y, 
			data.menu 
		);
	},
	
	targetSelectionType: "B",
	prepareTargets: function( data ){
		model.addUnloadTargetsToMenu( 
			data.source.unitId, 
			data.target.x, 
			data.target.y,
			data.action.selectedSubEntry, 
			data.selection 
		);
	},
	
	invoke: function( data ){
		controller.sharedInvokement( "unloadUnitFrom",[
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