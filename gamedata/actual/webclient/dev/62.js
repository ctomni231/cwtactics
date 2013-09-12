controller.unitAction({
  
  key:"unhideUnit",
  
	relation: ["S","T",model.relationModes.NONE,model.relationModes.SAME_OBJECT],
  
  condition: function( data ){
    return data.source.unit.hidden;
  },
  
  invoke: function( data ){
    controller.sharedInvokement("unhideUnit",[ 
			data.source.unitId 
		]);
  }
  
});