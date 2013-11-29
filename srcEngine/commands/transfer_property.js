controller.action_propertyAction({
  
  key:"transferProperty",
  hasSubMenu: true,
	relationToProp:[ "S","T", model.player_RELATION_MODES.SAME_OBJECT ],
  
  condition: function( data ){
    return model.team_isPropertyTransferable( data.source.propertyId );
  },
  
  prepareMenu: function( data ){
		model.team_addTransferTargets( data.source.unit.property, data.menu );
  },
  
  invoke: function( data ){
    controller.action_sharedInvoke("team_transferProperty",[ 
			data.source.propertyId, 
			data.action.selectedSubEntry 
		]);
  }
});