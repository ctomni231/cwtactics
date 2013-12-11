controller.action_unitAction({

	key:"fireLaser",
	relation:[ "S","T", model.player_RELATION_MODES.SAME_OBJECT],

	condition: function( data ){
		return model.bombs_isLaser( data.target.unitId );
	},

	invoke: function( data ){
		controller.action_sharedInvoke( "bombs_fireLaser", [ 
      data.target.x,
      data.target.y 
    ]);
	}

});
