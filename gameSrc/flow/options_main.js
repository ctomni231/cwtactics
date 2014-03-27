cwt.Gameflow.addState({
  id:"OPTIONS",

  init: function () {
    this.buttons = [
      "SFX_VOL_LEFT",
      "SFX_VOL_RIGHT",
      "MUSIC_VOL_LEFT",
      "MUSIC_VOL_RIGHT",
      "CHECKBOX_ANIMATED_TILES",
      "CHECKBOX_FORCE_TOUCH",
      "CHANGE_KEYBOARD_LAYOUT",
      "CHANGE_GAME_PAD_LAYOUT",
      "WIPE_OUT_DATA",
      "GO_BACK"
    ];

    this.doAction = function () {
      switch (this.buttons[this.index]) {

        // ----------------------------------------

        case "WIPE_OUT_DATA":
          cwt.Storage.wipeOutAll(function () {
            document.location.reload();
          });
          break;

        // ----------------------------------------
      }

      return null;
    };
  },

  enter: function () {
    this.index = 0;
  },

  update: function (delta, lastInput) {

    // last used input
    if (lastInput) {
      switch (lastInput.key) {

        // ----------------------------------------

        case cwt.Input.TYPE_DOWN:
          this.rendered = false;
          this.index++;
          if (this.index === this.buttons.length) {
            this.index = 0;
          }
          break;

        case cwt.Input.TYPE_UP:
          this.rendered = false;
          this.index--;
          if (this.index < 0) {
            this.index = this.buttons.length-1;
          }
          break;

        case cwt.Input.TYPE_ACTION:
          var result = this.doAction();
          if (result) return result;
          break;

        case cwt.Input.TYPE_CANCEL:
          return "MAIN_MENU";

        // ----------------------------------------
      }
    }
  },

  render: function (delta) {

  }
});


util.scoped(function(){
     /*
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

  // ------------------------------------------------------------------------------------------

  controller.screenStateMachine.structure.OPTIONS = Object.create(controller.stateParent);

  controller.screenStateMachine.structure.OPTIONS.forceTouch = false;

  controller.screenStateMachine.structure.OPTIONS.animatedTiles = true;


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
     */
});
