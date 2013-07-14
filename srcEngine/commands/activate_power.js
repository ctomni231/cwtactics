controller.mapAction({
  
  key:"activatePower",
  hasSubMenu: true,
  
  condition: function(){
    var coData = model.coData[ model.turnOwner ];
    
    if( coData.coA === null ) return false;
    if( coData.level !== model.powerLevel.INACTIVE ) return false;
    
    return ( coData.power >= model.coStarCost(model.turnOwner) * coData.coA.coStars );
  },
            
  prepareMenu: function( data ){
    var coData = model.coData[ model.turnOwner ];
    
    data.menu.addEntry("cop",  (coData.power >= model.coStarCost(model.turnOwner)* coData.coA.coStars)  );
    data.menu.addEntry("scop", (coData.power >= model.coStarCost(model.turnOwner)* coData.coA.scoStars) );
  },
          
  invoke: function( data ){    
    var cmd;
    
    switch ( data.action.selectedSubEntry ){
      case "cop" :  cmd = "activateCoPower";      break;
      case "scop" : cmd = "activateSuperCoPower"; break;
    }
    
    if(!cmd) model.criticalError( constants.error.ILLEGAL_PARAMETERS, constants.error.UNKNOWN );
    
    controller.sharedInvokement(cmd,[model.turnOwner]);
  }
  
});