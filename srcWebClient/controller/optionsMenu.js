controller.mapAction({

  key:"options",  
  hasSubMenu: true,
  
  condition: function( data ){
    var unit = data.source.unit;
    if( unit !== null && unit.owner === model.turnOwner && model.canAct( data.source.unitId) ) return false;
       
    var property = data.source.property;
    if( property !== null && property.type.builds ) return false;
    
    return true;
  },
  
  prepareMenu: function( data ){
    data.menu.addEntry("options.sfx");
    data.menu.addEntry("options.music");
    data.menu.addEntry("options.yield");
  },
  
  invoke: function( data ){
    var cmd = data.action.selectedSubEntry;
    switch( cmd ){
        
      case "options.sfx":
        if( controller.getSfxVolume() > 0 ) controller.setSfxVolume(0);
        else controller.setSfxVolume(1);
        break;
        
      case "options.music":
        if( controller.getMusicVolume() > 0 ) controller.setMusicVolume(0);
        else controller.setMusicVolume(1);
        break;
        
      case "options.yield":
        controller.endGameRound();
        break;
    }
  }
  
});