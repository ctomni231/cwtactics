util.scoped(function(){
  
  function saveComplete(){
    if( constants.DEBUG ) util.log("successfully set new mod path");
  }
  
  function wipeComplete(){
    document.location.reload();
  }
  
  var nodeSfx = document.getElementById("cwt_options_sfxVolume");
  var nodeMusic = document.getElementById("cwt_options_musicVolume");
  function updateSoundContent(){  
    nodeSfx.innerHTML = Math.round(controller.getSfxVolume()*100);
    nodeMusic.innerHTML = Math.round(controller.getMusicVolume()*100);
  }
  
  var btn = controller.generateButtonGroup( 
    document.getElementById("cwt_options_screen"),
    "menuButton ui-font ui-subheader ui-panel-button",
    "menuButton ui-font ui-subheader ui-panel-button active",
    "menuButton ui-font ui-subheader ui-panel-button inactive"
  );
  
  // ------------------------------------------------------------------------------------------
  
  controller.screenStateMachine.structure.OPTIONS = Object.create(controller.stateParent);
  
	controller.screenStateMachine.structure.OPTIONS.section = "cwt_options_screen";
	
  controller.screenStateMachine.structure.OPTIONS.enterState = function(){  
    updateSoundContent();
    btn.setIndex(1);
  };
  
  controller.screenStateMachine.structure.OPTIONS.UP = function(){
    btn.decreaseIndex();
    return this.breakTransition();
  };
  
  controller.screenStateMachine.structure.OPTIONS.DOWN = function(){
    btn.increaseIndex();
    return this.breakTransition();
  };
  
  controller.screenStateMachine.structure.OPTIONS.ACTION = function(){
    switch( btn.getActiveKey() ){
        
      case "options.sfx.down":
        controller.setSfxVolume( controller.getSfxVolume()-0.05 );
        updateSoundContent();
        break;
        
      case "options.sfx.up":
        controller.setSfxVolume( controller.getSfxVolume()+0.05 );
        updateSoundContent();
        break;
        
      case "options.music.down":
        controller.setMusicVolume( controller.getMusicVolume()-0.05 );
        updateSoundContent();
        break;
        
      case "options.music.up":
        controller.setMusicVolume( controller.getMusicVolume()+0.05 );
        updateSoundContent();
        break;
        
      case "options.resetData":
        controller.storage.set("resetDataAtStart",{value:true}, wipeComplete );
        break;
        
      case "options.goBack": 
        controller.saveSoundConfigs();
        return "MAIN";
    }
    
    return this.breakTransition();
  };
    
  controller.screenStateMachine.structure.OPTIONS.CANCEL = function(){
    controller.saveSoundConfigs();
    return "MAIN";
  };
  
});