controller.unitAction({
  
  key:"transferUnit",
  hasSubMenu: true,
	relation: ["S","T",model.relationModes.SAME_OBJECT],
  
  condition: function( data ){
    return model.isUnitTransferable( data.source.unitId );
  },
  
  prepareMenu: function( data ){
		model.addTransferTargets( data.source.unit.owner, data.menu );
  },
  
  invoke: function( data ){
    controller.sharedInvokement("transferUnit",[ 
			data.source.unitId, 
			data.action.selectedSubEntry 
		]);
  }
  
});