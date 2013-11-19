controller.action_clientAction({

  key:"options",  
  hasSubMenu: true,
  
  condition: function( data ){
    return true;
  },
  
  prepareMenu: function( data ){
    data.menu.addEntry("options.sfx");
    data.menu.addEntry("options.music");

    // you only can yield when you're the turn owner
    if( model.client_isLocalPid(model.round_turnOwner) ) data.menu.addEntry("options.yield");
  },
  
  invoke: function( data ){
    var cmd = data.action.selectedSubEntry;
    switch( cmd ){
        
      case "options.sfx":
        if( controller.audio_getSfxVolume() > 0 ) controller.audio_setSfxVolume(0);
        else controller.audio_setSfxVolume(1);
        break;
        
      case "options.music":
        if( controller.audio_getMusicVolume() > 0 ) controller.audio_setMusicVolume(0);
        else controller.audio_setMusicVolume(1);
        break;
        
      case "options.yield":
        controller.action_sharedInvoke("player_playerGivesUp", []);
        break;
    }
  }
  
});