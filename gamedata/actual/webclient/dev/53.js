controller.unitAction({
  
  key:"hideUnit",
	
	relation: ["S","T",model.relationModes.NONE,model.relationModes.SAME_OBJECT],
  
  condition: function( data ){
    var unit = data.source.unit;
    return unit.type.stealth && !unit.hidden;
  },
          
  invoke: function( data ){
    controller.sharedInvokement("hideUnit",[ 
			data.source.unitId 
		]);
  }
  
});