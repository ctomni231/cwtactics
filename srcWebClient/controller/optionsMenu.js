controller.clientAction({

  key:"options",  
  hasSubMenu: true,
  
  condition: function( data ){
    return true;
  },
  
  prepareMenu: function( data ){
    data.menu.addEntry("options.sfx");
    data.menu.addEntry("options.music");

    // you only can yield when you're the turn owner
    if( model.isClientPlayer(model.turnOwner) ) data.menu.addEntry("options.yield");
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
        controller.sharedInvokement("playerGivesUp", []);
        break;
    }
  }
  
});