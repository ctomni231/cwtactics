controller.unitAction({
  
  key:"loadUnit",
  
	relation: ["S","T",model.relationModes.OWN],
	
  condition: function( data ){
    var tuid = data.target.unitId;
    return model.isTransport( tuid ) && model.canLoad( data.source.unitId, tuid );
  },
  
  invoke: function( data ){
    controller.sharedInvokement( "loadUnitInto",[ 
			data.source.unitId, 
			data.target.unitId 
		]);
  }
 
});