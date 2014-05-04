cwt.ButtonFlowState({

  id: "OPTIONS",
  last: "MAIN_MENU",

  enter: function () {
    this.layout.getButtonByKey("OPTIONS_CHECKBOX_FORCE_TOUCH").checked = cwt.Options.forceTouch;
    this.layout.getButtonByKey("OPTIONS_CHECKBOX_ANIMATED_TILES").checked = cwt.Options.animatedTiles;
    this.layout.getButtonByKey("OPTIONS_SFX_VOL").text = Math.round(cwt.Audio.getSfxVolume() * 100).toString();
    this.layout.getButtonByKey("OPTIONS_MUSIC_VOL").text = Math.round(cwt.Audio.getMusicVolume() * 100).toString();
  },

  init: function (layout) {

    var h = parseInt((cwt.SCREEN_HEIGHT - 18) / 2, 10);
    var w = parseInt((cwt.SCREEN_WIDTH - 16) / 2, 10);

    var sfxButton;
    var musicButton;

    var saveStep1 = function () {
      cwt.Audio.saveConfigs(saveStep2);
    };

    var saveStep2 = function () {
      cwt.Gameflow.changeState("MAIN_MENU");
    };

    var updateSound = function (isSFX,change,state) {
      var vol = ((isSFX)? cwt.Audio.getSfxVolume() : cwt.Audio.getMusicVolume()) + change;
      (isSFX)? cwt.Audio.setSfxVolume(vol) : cwt.Audio.setMusicVolume(vol);
      ((isSFX)? sfxButton : musicButton).text = Math.round(vol * 100).toString();
      state.rendered = false;
    }

    layout

      .addRowGap(h)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(4, 2, 0, "OPTIONS_SFX_VOL_DOWN", cwt.UIField.STYLE_NW, function () {
        updateSound(true,-0.05,this);
      })
      .addButton(8, 2, 0, "OPTIONS_SFX_VOL", cwt.UIField.STYLE_N)
      .addButton(4, 2, 0, "OPTIONS_SFX_VOL_UP", cwt.UIField.STYLE_NE, function () {
        updateSound(true,+0.05,this);
      })
      .breakLine()

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(4, 2, 0, "OPTIONS_MUSIC_VOL_DOWN", cwt.UIField.STYLE_SW, function () {
        updateSound(false,-0.05,this);
      })
      .addButton(8, 2, 0, "OPTIONS_MUSIC_VOL", cwt.UIField.STYLE_S)
      .addButton(4, 2, 0, "OPTIONS_MUSIC_VOL_UP", cwt.UIField.STYLE_ES, function () {
        updateSound(false,+0.05,this);
      })
      .breakLine()

      // -------------------------------------------------------

      .addRowGap(1)

      // -------------------------------------------------------

      .addColGap(w)
      .addCheckbox(2, 2, 0, "OPTIONS_CHECKBOX_ANIMATED_TILES", cwt.UIField.STYLE_NW)
      .addButton(14, 2, 0, "OPTIONS_CHECKBOX_ANIMATED_TILES_TEXT", cwt.UIField.STYLE_NE, 8)
      .breakLine()

      .addColGap(w)
      .addCheckbox(2, 2, 0, "OPTIONS_CHECKBOX_FORCE_TOUCH", cwt.UIField.STYLE_SW)
      .addButton(14, 2, 0, "OPTIONS_CHECKBOX_FORCE_TOUCH_TEXT", cwt.UIField.STYLE_ES, 8)
      .breakLine()

      // -------------------------------------------------------

      .addRowGap(1)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(8, 2, 0, "OPTIONS_MENU_CHANGE_KEYBOARD_LAYOUT", cwt.UIField.STYLE_NSW, 8, function () {
        cwt.Gameflow.changeState("REMAP_KEY_MAPPING");
        cwt.Gameflow.activeState.mode = 0;
      })
      .addButton(8, 2, 0, "OPTIONS_MENU_CHANGE_GAMEPAD_LAYOUT", cwt.UIField.STYLE_NES, 8, function () {
        cwt.Gameflow.changeState("REMAP_KEY_MAPPING");
        cwt.Gameflow.activeState.mode = 1;
      })
      .breakLine()

      // -------------------------------------------------------

      .addRowGap(1)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(16, 2, 0, "OPTIONS_MENU_WIPE_OUT", cwt.UIField.STYLE_NORMAL, 8, function () {
        cwt.Gameflow.changeState("CONFIRM_WIPE_OUT_SCREEN");
      })
      .breakLine()

      // -------------------------------------------------------

      .addRowGap(1)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(6, 2, 0, "OPTIONS_MENU_GO_BACK", cwt.UIField.STYLE_NORMAL, 8, function () {

        // update options
        cwt.Options.forceTouch = (this.layout.getButtonByKey("OPTIONS_CHECKBOX_FORCE_TOUCH").checked === true);
        cwt.Options.animatedTiles = (this.layout.getButtonByKey("OPTIONS_CHECKBOX_ANIMATED_TILES").checked === true);

        // save options
        cwt.Options.saveOptions(saveStep1);
      });

    sfxButton = layout.getButtonByKey("OPTIONS_SFX_VOL");
    musicButton = layout.getButtonByKey("OPTIONS_MUSIC_VOL");
  }
});