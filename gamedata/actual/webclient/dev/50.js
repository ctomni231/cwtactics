controller.unitAction({
	
	key:"fireCannon",
	relation:[ "S","T", model.relationModes.SAME_OBJECT],
	
	condition: function( data ){
		return (
      model.isCannon( data.target.unitId ) &&
      model.markCannonTargets( data.target.unitId, data.selection ) 
    );
	},
	
	targetSelectionType: "A",
	prepareTargets: function( data ){
    model.markCannonTargets( data.target.unitId, data.selection );
	},
	
	invoke: function( data ){
		controller.sharedInvokement( "fireCannon", [
			data.target.unitId,
			data.targetselection.x, 
			data.targetselection.y
		]);
	}
	
});