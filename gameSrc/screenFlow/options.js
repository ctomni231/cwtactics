util.scoped(function(){

  function wipeComplete(){
    document.location.reload();
  }

  function changeForceTouch(){
    controller.screenStateMachine.structure.OPTIONS.forceTouch = !controller.screenStateMachine.structure.OPTIONS.forceTouch;
    updateforceTouchContent();
  }

  function updateforceTouchContent(){
    nodeTouch.innerHTML = (controller.screenStateMachine.structure.OPTIONS.forceTouch)? model.data_localized("yes") :
                                                                                        model.data_localized("no");
  }  
  
  function changeAnimatedTiles(){
    controller.screenStateMachine.structure.OPTIONS.animatedTiles = !controller.screenStateMachine.structure.OPTIONS.animatedTiles;
    updateAnimatedTilesContent();
  }

  function updateAnimatedTilesContent(){
    nodeAnimTiles.innerHTML = (controller.screenStateMachine.structure.OPTIONS.animatedTiles)? model.data_localized("yes") :
                                                                                               model.data_localized("no");
  }

  function updateSoundContent(){
    nodeSfx.innerHTML = Math.round(controller.audio_getSfxVolume()*100);
    nodeMusic.innerHTML = Math.round(controller.audio_getMusicVolume()*100);
  }

  var nodeSfx   = document.getElementById("cwt_options_sfxVolume");
  var nodeMusic = document.getElementById("cwt_options_musicVolume");
  var nodeTouch = document.getElementById("cwt_options_forceTouch");
  var nodeAnimTiles = document.getElementById("cwt_options_animatedTiles");

  var btn = controller.generateButtonGroup(
    document.getElementById("cwt_options_screen"),
    "cwt_panel_header_small cwt_page_button w_400 cwt_panel_button",
    "cwt_panel_header_small cwt_page_button w_400 cwt_panel_button button_active",
    "cwt_panel_header_small cwt_page_button w_400 cwt_panel_button button_inactive"
  );

  var sourceState;

  // ------------------------------------------------------------------------------------------

  controller.screenStateMachine.structure.OPTIONS = Object.create(controller.stateParent);

  controller.screenStateMachine.structure.OPTIONS.forceTouch = false;

  controller.screenStateMachine.structure.OPTIONS.animatedTiles = true;

  controller.screenStateMachine.structure.OPTIONS.section = "cwt_options_screen";

  controller.screenStateMachine.structure.OPTIONS.enterState = function(_,source){
    sourceState = ( sourceState || source === true )? true : false;

    updateSoundContent();
    updateforceTouchContent();
    updateAnimatedTilesContent();
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
        btn.increaseIndex();
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
        return "REMAP_KEYBOARD";

      case "options.setGamepad":
        return "REMAP_GAMEPAD";

      case "options.resetData":
        return "WIPEOUT";

      case "options.forceTouch":
        changeForceTouch();
        break;
        
      case "options.animatedTiles":
        changeAnimatedTiles();
        break;

      case "options.goBack":
        controller.audio_saveConfigs();
        controller.storage_general.set("cwt_forceTouch",controller.screenStateMachine.structure.OPTIONS.forceTouch);
        controller.storage_general.set("cwt_animatedTiles",controller.screenStateMachine.structure.OPTIONS.animatedTiles);
        
        var target = (sourceState)? "GAMEROUND" : "MAIN";
        sourceState = false;
        return target;
    }

    return this.breakTransition();
  };

  controller.screenStateMachine.structure.OPTIONS.CANCEL = function(){
    controller.audio_saveConfigs();
    return (sourceState)? "GAMEROUND" : "MAIN";
  };

});
