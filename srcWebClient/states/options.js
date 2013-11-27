util.scoped(function(){

  function wipeComplete(){
    document.location.reload();
  }

  function updateSoundContent(){  
    nodeSfx.innerHTML = Math.round(controller.audio_getSfxVolume()*100);
    nodeMusic.innerHTML = Math.round(controller.audio_getMusicVolume()*100);
  }
  
  var nodeSfx   = document.getElementById("cwt_options_sfxVolume");
  var nodeMusic = document.getElementById("cwt_options_musicVolume");
  
  var btn = controller.generateButtonGroup( 
    document.getElementById("cwt_options_screen"),
    "cwt_panel_header_small cwt_page_button w_400 cwt_panel_button",
    "cwt_panel_header_small cwt_page_button w_400 cwt_panel_button button_active",
    "cwt_panel_header_small cwt_page_button w_400 cwt_panel_button button_inactive"
  );

  var sourceState;
  
  // ------------------------------------------------------------------------------------------
  
  controller.screenStateMachine.structure.OPTIONS = Object.create(controller.stateParent);
  
	controller.screenStateMachine.structure.OPTIONS.section = "cwt_options_screen";
	
  controller.screenStateMachine.structure.OPTIONS.enterState = function(_,source){
    sourceState = ( typeof source !== "undefined" )? source : null;

    updateSoundContent();
    btn.setIndex(1);
  };
  
  controller.screenStateMachine.structure.OPTIONS.UP = function(){
    switch( btn.getActiveKey() ){
        
      case "options.sfx.up":
      case "options.music.up":
      case "options.music.down":
        btn.decreaseIndex();
        btn.decreaseIndex();
        break;

      default: 
        btn.decreaseIndex();
    }

    return this.breakTransition();
  };
  
  controller.screenStateMachine.structure.OPTIONS.DOWN = function(){
    switch( btn.getActiveKey() ){
        
      case "options.sfx.up":
      case "options.sfx.down":
      case "options.music.down":
        btn.increaseIndex();
        btn.increaseIndex();
        break;
                
      default: 
        btn.increaseIndex();
    }

    return this.breakTransition();
  };

  controller.screenStateMachine.structure.OPTIONS.LEFT = function(){
    switch( btn.getActiveKey() ){
      case "options.sfx.up":
      case "options.music.up":
        btn.decreaseIndex();
        break;
    }

    return this.breakTransition();
  };


  controller.screenStateMachine.structure.OPTIONS.RIGHT = function(){
    switch( btn.getActiveKey() ){
      case "options.sfx.down":
      case "options.music.down":
        btn.increaseIndex();
        break;
    }

    return this.breakTransition();
  };
  
  controller.screenStateMachine.structure.OPTIONS.ACTION = function(){
    switch( btn.getActiveKey() ){
        
      case "options.sfx.down":
        controller.audio_setSfxVolume( controller.audio_getSfxVolume()-0.05 );
        updateSoundContent();
        break;
        
      case "options.sfx.up":
        controller.audio_setSfxVolume( controller.audio_getSfxVolume()+0.05 );
        updateSoundContent();
        break;
        
      case "options.music.down":
        controller.audio_setMusicVolume( controller.audio_getMusicVolume()-0.05 );
        updateSoundContent();
        break;
        
      case "options.music.up":
        controller.audio_setMusicVolume( controller.audio_getMusicVolume()+0.05 );
        updateSoundContent();
        break;
        
      case "options.setKeyboad":
        controller.activeMapping = controller.KEY_MAPPINGS.KEYBOARD;
        return "REMAP_KEYS";

      case "options.setGamepad":
        controller.activeMapping = controller.KEY_MAPPINGS.GAMEPAD;
        return "REMAP_KEYS";

      case "options.resetData":
        controller.storage_general.set("resetDataAtStart",{value:true}, wipeComplete );
        break;
        
      case "options.goBack": 
        controller.audio_saveConfigs();
        return (sourceState !== null)? sourceState : "MAIN";
    }
    
    return this.breakTransition();
  };
    
  controller.screenStateMachine.structure.OPTIONS.CANCEL = function(){
    controller.audio_saveConfigs();
    return (sourceState !== null)? sourceState : "MAIN";
  };
  
});
