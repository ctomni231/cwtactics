controller.unitAction({
  
  key:"explode",
	
	relation: ["S","T",model.relationModes.NONE,model.relationModes.SAME_OBJECT],
  
  condition: function( data ){
    return model.isSuicideUnit( data.source.unitId );
  },
  
  invoke: function( data ){
    controller.sharedInvokement("destroyUnit_silent",[ 
      data.source.unitId 
    ]);
    
    controller.sharedInvokement("fireBombAt",[ 
      data.target.x, data.target.y,
      data.source.unit.type.suicide.range,
      model.ptToHp(data.source.unit.type.suicide.damage),
      data.source.unit.owner
    ]);
  }
  
});