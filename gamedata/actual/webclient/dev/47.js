controller.mapAction({
  
  key:"activatePower",
  hasSubMenu: true,
  
  condition: function(){
		return model.canActivatePower( model.turnOwner, model.powerLevel.COP );
  },
            
  prepareMenu: function( data ){
    var coData = model.coData[ model.turnOwner ];
    
		data.menu.addEntry("cop");
		if( model.canActivatePower( model.turnOwner, model.powerLevel.SCOP ) ) data.menu.addEntry("scop");
  },
          
  invoke: function( data ){    
		
    var cmd;
    switch ( data.action.selectedSubEntry ){
				
      case "cop":  
				cmd = "activateCoPower";      
				break;
				
      case "scop": 
				cmd = "activateSuperCoPower"; 
				break;
				
			default:
				model.criticalError( 
					constants.error.ILLEGAL_PARAMETERS, 
					constants.error.UNKNOWN 
				);
    }
    
    controller.sharedInvokement(cmd,[model.turnOwner]);
  }
  
});