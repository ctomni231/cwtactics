controller.action_propertyAction({

	key:"fireCannon",
  unitAction: true,
	relation:[ "S","T", model.player_RELATION_MODES.SAME_OBJECT],

	condition: function( data ){
		return (
      model.bombs_isCannon( data.target.unitId ) &&
      model.bombs_markCannonTargets( data.target.unitId, data.selection )
    );
	},

	targetSelectionType: "A",
	prepareTargets: function( data ){
    	model.bombs_markCannonTargets( data.target.unitId, data.selection );
	},

	invoke: function( data ){
		controller.action_sharedInvoke( "bombs_fireCannon", [
			data.target.x,
      data.target.y,
			data.targetselection.x,
			data.targetselection.y
		]);
	}

});
