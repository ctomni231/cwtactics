cwt.ButtonFlowState({

  id: "OPTIONS",
  last: "MAIN_MENU",

  init: function (layout) {

    var h = parseInt((cwt.SCREEN_HEIGHT - 18) / 2, 10);
    var w = parseInt((cwt.SCREEN_WIDTH - 16) / 2, 10);

    layout

      .addRowGap(h)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(4, 2, 0, "OPTIONS_SFX_VOL_DOWN", function () {

      })
      .addButton(8, 2, 0, "")
      .addButton(4, 2, 0, "OPTIONS_SFX_VOL_UP", function () {

      })
      .breakLine()

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(4, 2, 0, "OPTIONS_MUSIC_VOL_DOWN", function () {

      })
      .addButton(8, 2, 0, "")
      .addButton(4, 2, 0, "OPTIONS_MUSIC_VOL_UP", function () {

      })
      .breakLine()

      // -------------------------------------------------------

      .addRowGap(1)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(2, 2, 0, "")
      .addButton(14, 2, 0, "OPTIONS_CHECKBOX_ANIMATED_TILES_TEXT",8)
      .breakLine()

      .addColGap(w)
      .addButton(2, 2, 0, "")
      .addButton(14, 2, 0, "OPTIONS_CHECKBOX_FORCE_TOUCH_TEXT",8)
      .breakLine()

      // -------------------------------------------------------

      .addRowGap(1)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(8, 2, 0, "OPTIONS_MENU_CHANGE_KEYBOARD_LAYOUT",8)
      .addButton(8, 2, 0, "OPTIONS_MENU_CHANGE_GAMEPAD_LAYOUT",8)
      .breakLine()

      // -------------------------------------------------------

      .addRowGap(1)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(16, 2, 0, "OPTIONS_MENU_WIPE_OUT", function () {
        cwt.Gameflow.changeState("CONFIRM_WIPE_OUT_SCREEN");
      })
      .breakLine()

      // -------------------------------------------------------

      .addRowGap(1)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(6, 2, 0, "OPTIONS_MENU_GO_BACK", function () {
        cwt.Gameflow.changeState("MAIN_MENU");
      });
  }
});


/*
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
 });
 */
