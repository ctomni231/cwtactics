"use strict";

var statemachine = require("../statemachine");
var constants = require("../constants");
var widgets = require("../uiWidgets");

var renderer = require("../renderer");
var config = require("../config");
var image = require("../image");
var input = require("../input");
var audio = require("../audio");

var audioDto = require("../dataTransfer/audio");
var configDto = require("../dataTransfer/config");

var h = parseInt((constants.SCREEN_HEIGHT - 18) / 2, 10);
var w = parseInt((constants.SCREEN_WIDTH - 16) / 2, 10);

var sfxButton;
var musicButton;

var saveStep1 = function () {
  audioDto.saveVolumeConfigs(saveStep2);
};

var saveStep2 = function () {
  statemachine.changeState("MAIN_MENU");
};

var updateSound = function (isSFX,change,state) {
  var vol = ((isSFX)? audio.getSfxVolume() : audio.getMusicVolume()) + change;
  (isSFX)? audio.setSfxVolume(vol) : audio.setMusicVolume(vol);
  ((isSFX)? sfxButton : musicButton).text = Math.round(vol * 100).toString();
  state.rendered = false;
};

exports.state = {

  id: "OPTIONS",
  last: "MAIN_MENU",

  enter: function (layout) {
    layout.getButtonByKey("OPTIONS_CHECKBOX_FORCE_TOUCH").checked =  config.getConfig("forceTouch").value;
    layout.getButtonByKey("OPTIONS_CHECKBOX_ANIMATED_TILES").checked =  config.getConfig("animatedTiles").value;
    layout.getButtonByKey("OPTIONS_SFX_VOL").text = Math.round(audio.getSfxVolume() * 100).toString();
    layout.getButtonByKey("OPTIONS_MUSIC_VOL").text = Math.round(audio.getMusicVolume() * 100).toString();
  },

  doLayout: function (layout) {

    layout

      .addRowGap(h)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(4, 2, 0, "OPTIONS_SFX_VOL_DOWN", widgets.UIField.STYLE_NW, function () {
        updateSound(true,-0.05,this);
      })
      .addButton(8, 2, 0, "OPTIONS_SFX_VOL", widgets.UIField.STYLE_N, 8)
      .addButton(4, 2, 0, "OPTIONS_SFX_VOL_UP", widgets.UIField.STYLE_NE, function () {
        updateSound(true,+0.05,this);
      })
      .breakLine()

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(4, 2, 0, "OPTIONS_MUSIC_VOL_DOWN", widgets.UIField.STYLE_SW, function () {
        updateSound(false,-0.05,this);
      })
      .addButton(8, 2, 0, "OPTIONS_MUSIC_VOL", widgets.UIField.STYLE_S, 8)
      .addButton(4, 2, 0, "OPTIONS_MUSIC_VOL_UP", widgets.UIField.STYLE_ES, function () {
        updateSound(false,+0.05,this);
      })
      .breakLine()

      // -------------------------------------------------------

      .addRowGap(1)

      // -------------------------------------------------------

      .addColGap(w)
      .addCheckbox(2, 2, 0, "OPTIONS_CHECKBOX_ANIMATED_TILES", widgets.UIField.STYLE_NW)
      .addButton(14, 2, 0, "OPTIONS_CHECKBOX_ANIMATED_TILES_TEXT", widgets.UIField.STYLE_NE, 8)
      .breakLine()

      .addColGap(w)
      .addCheckbox(2, 2, 0, "OPTIONS_CHECKBOX_FORCE_TOUCH", widgets.UIField.STYLE_SW)
      .addButton(14, 2, 0, "OPTIONS_CHECKBOX_FORCE_TOUCH_TEXT", widgets.UIField.STYLE_ES, 8)
      .breakLine()

      // -------------------------------------------------------

      .addRowGap(1)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(8, 2, 0, "OPTIONS_MENU_CHANGE_KEYBOARD_LAYOUT", widgets.UIField.STYLE_NSW, 8, function () {
        statemachine.changeState("REMAP_KEY_MAPPING");
        statemachine.activeState.mode = 0;
      })
      .addButton(8, 2, 0, "OPTIONS_MENU_CHANGE_GAMEPAD_LAYOUT", widgets.UIField.STYLE_NES, 8, function () {
        statemachine.changeState("REMAP_KEY_MAPPING");
        statemachine.activeState.mode = 1;
      })
      .breakLine()

      // -------------------------------------------------------

      .addRowGap(1)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(16, 2, 0, "OPTIONS_MENU_WIPE_OUT", widgets.UIField.STYLE_NORMAL, 8, function () {
        statemachine.changeState("CONFIRM_WIPE_OUT_SCREEN");
      })
      .breakLine()

      // -------------------------------------------------------

      .addRowGap(1)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(6, 2, 0, "OPTIONS_MENU_GO_BACK", widgets.UIField.STYLE_NORMAL, 8, function () {

        // update options
        config.getConfig("forceTouch").value = (layout.getButtonByKey(
          "OPTIONS_CHECKBOX_FORCE_TOUCH").checked === true);

        config.getConfig("animatedTiles").value = (layout.getButtonByKey(
          "OPTIONS_CHECKBOX_ANIMATED_TILES").checked === true);

        // save options
        configDto.save(saveStep1);
      });

    sfxButton = layout.getButtonByKey("OPTIONS_SFX_VOL");
    musicButton = layout.getButtonByKey("OPTIONS_MUSIC_VOL");
  }
};