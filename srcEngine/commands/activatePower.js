controller.mapAction({
  
  key:"activatePower",
  hasSubMenu: true,
  
  condition: function(){
    var player = model.players[ model.turnOwner ];
    
    if( player.mainCo === null ) return false;
    if( player.coPower_active !== model.INACTIVE_POWER ) return false;
    
    return ( player.power >= model.coStarCost(model.turnOwner)*player.mainCo.coStars );
  },
            
  prepareMenu: function( data ){
    data.action.addEntry("cop", (player.power >= model.coStarCost(model.turnOwner)*player.mainCo.coStars) );
    data.action.addEntry("scop", (player.power >= model.coStarCost(model.turnOwner)*player.mainCo.scoStars) );
  },
          
  invoke: function( data ){    
    switch ( data.action.selectedSubEntry ){
      
      case "cop" : 
        model.activateCoPower.callAsCommand(model.turnOwner);
        break;
        
      case "scop" : 
        model.activateSuperCoPower.callAsCommand(model.turnOwner);
        break;
    }
  }
  
});