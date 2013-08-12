controller.unitAction({
  
  key:"wait",
  
	relation: ["S","T",model.relationModes.NONE,model.relationModes.SAME_OBJECT],
  
  invoke: function( data ){
    controller.sharedInvokement("markUnitNonActable",[data.source.unitId]);
  }
  
});