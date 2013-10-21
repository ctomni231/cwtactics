controller.unitAction({
  
  key:"attack",
  
  unitAction: true,
  targetSelectionType:"A",
	
	relation:[ "S", "T", model.relationModes.NONE, model.relationModes.SAME_OBJECT ],
  
  prepareTargets: function( data ){
    model.attackRangeMod_( data.source.unitId, data.target.x, data.target.y, data.selection );
  },
  
  condition: function( data ){
		if( model.isPeacePhaseActive() ) return false;
		if( model.isIndirectUnit(data.source.unitId) && data.movePath.data.getSize() > 0 ) return false;
    return model.hasTargets( data.source.unitId, data.target.x, data.target.y );
  },
          
  invoke: function( data ){
    if( data.targetselection.unitId !== -1 ){
      controller.sharedInvokement("battleBetween",[
        data.source.unitId,
        data.targetselection.unitId,
        Math.round( Math.random()*100 ),
        Math.round( Math.random()*100 )
      ]);
    }
    else if( data.targetselection.propertyId !== -1 ){
      controller.sharedInvokement("attackBattleProperty",[
        data.source.unitId,
        data.targetselection.propertyId
      ]);
    }
    else model.errorIllegalArguments("attack","no valid target");
  }
});
