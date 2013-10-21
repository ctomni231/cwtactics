controller.propertyAction({

	key:"fireLaser",
	relation:[ "S","T", model.relationModes.SAME_OBJECT],

	condition: function( data ){
		return model.isCannon( data.target.unitId );
	},

	invoke: function( data ){
		controller.sharedInvokement( "fireLaser", [ data.target.propertyId ]);
	}

});
