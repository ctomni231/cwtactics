controller.unitAction({
  
  key:"joinUnits",
  
	relation:["S","T",model.relationModes.OWN],
	
  condition: function( data ){
    return model.canJoin( data.source.unitId, data.target.unitId );
  },
  
  invoke: function( data ){
    controller.sharedInvokement("joinUnits",[ 
			data.source.unitId, data.target.unitId 
		]);
  }
  
});