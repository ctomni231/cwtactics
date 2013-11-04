controller.action_mapAction({
  
  key:"model.co_model.co_activatePower__",
  hasSubMenu: true,
  
  condition: function(){
		return (
			( model.co_activeMode === model.co_MODES.AW1 ||
			  model.co_activeMode === model.co_MODES.AW2 ||
			  model.co_activeMode === model.co_MODES.AWDS   ) &&
			model.co_canActivatePower( model.round_turnOwner, model.co_POWER_LEVEL.COP )
		);
  },
            
  prepareMenu: function( data ){
    var co_data = model.co_data[ model.round_turnOwner ];
    
		data.menu.addEntry("cop");
		if( model.co_canActivatePower( model.round_turnOwner, model.co_POWER_LEVEL.SCOP ) ) data.menu.addEntry("scop");
  },
          
  invoke: function( data ){    
		
    var cmd;
    switch ( data.action.selectedSubEntry ){
				
      case "cop":  
				cmd = "co_activateCOP";      
				break;
				
      case "scop": 
				cmd = "co_activateSCOP"; 
				break;
				
			default: model.errorUnknown("model.co_model.co_activatePower__");
    }
    
    controller.action_sharedInvoke(cmd,[model.round_turnOwner]);
  }
  
});
