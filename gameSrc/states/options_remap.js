"use strict";

var constants = require("../constants");
var widgets = require("../uiWidgets");

var renderer = require("../renderer");
var assert = require("../functions").assert;

var keyboard = require("../input/keyboard").backend;
var gamepad = require("../input/gamepad").backend;

var input = require("../input");
var inputDto = require("../dataTransfer/keyMapping");

var mappingKeys;
var index = 0;

exports.mode = 0;

exports.state = {

  id: "REMAP_KEY_MAPPING",
  last: "OPTIONS",

  enter: function () {
    // TODO handling for gamePad mode ?
    var map = keyboard.mapping;
    mappingKeys[0].text = input.codeToChar(map.RIGHT);
    mappingKeys[1].text = input.codeToChar(map.LEFT);
    mappingKeys[2].text = input.codeToChar(map.DOWN);
    mappingKeys[3].text = input.codeToChar(map.UP);
    mappingKeys[4].text = input.codeToChar(map.ACTION);
    mappingKeys[5].text = input.codeToChar(map.CANCEL);
  },

  genericInput: function (keyCode) {

    var code = null;
    switch (index) {
      case 0: code = "RIGHT"; break;
      case 1: code = "LEFT"; break;
      case 2: code = "DOWN"; break;
      case 3: code = "UP"; break;
      case 4: code = "ACTION"; break;
      case 5: code = "CANCEL"; break;
    }

    assert(code);

    // set string conversion of code into the field
    mappingKeys[index].text = (exports.mode === 0)? input.codeToChar(keyCode) : keyCode;
    ((exports.mode === 0)? keyboard.MAPPING : gamepad.MAPPING)[code] = keyCode;

    this.doRender();

    // increase index
    index++;
    if (index >= mappingKeys.length) {

      // release generic input request
      input.genericInput = false;
    }
  },

  init: function (layout) {
    exports.mode = 0;

    mappingKeys = [
      layout.getButtonByKey("VALUE_R"),
      layout.getButtonByKey("VALUE_L"),
      layout.getButtonByKey("VALUE_D"),
      layout.getButtonByKey("VALUE_U"),
      layout.getButtonByKey("VALUE_A"),
      layout.getButtonByKey("VALUE_C")
    ];
  },

  doLayout: function (layout) {
    var h = parseInt((constants.SCREEN_HEIGHT - 16) / 2, 10);
    var w = parseInt((constants.SCREEN_WIDTH - 12) / 2, 10);

    layout

      .addRowGap(h)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(4, 2, 0, "OPTIONS_KEYMAP_RIGHT", widgets.UIField.STYLE_NW, 8)
      .addButton(8, 2, 0, "VALUE_R", widgets.UIField.STYLE_NE, 8)
      .breakLine()

      .addColGap(w)
      .addButton(4, 2, 0, "OPTIONS_KEYMAP_LEFT", widgets.UIField.STYLE_W, 8)
      .addButton(8, 2, 0, "VALUE_L", widgets.UIField.STYLE_E, 8)
      .breakLine()

      .addColGap(w)
      .addButton(4, 2, 0, "OPTIONS_KEYMAP_DOWN", widgets.UIField.STYLE_W, 8)
      .addButton(8, 2, 0, "VALUE_D", widgets.UIField.STYLE_E, 8)
      .breakLine()

      .addColGap(w)
      .addButton(4, 2, 0, "OPTIONS_KEYMAP_UP", widgets.UIField.STYLE_W, 8)
      .addButton(8, 2, 0, "VALUE_U", widgets.UIField.STYLE_E, 8)
      .breakLine()

      .addColGap(w)
      .addButton(4, 2, 0, "OPTIONS_KEYMAP_ACTION", widgets.UIField.STYLE_W, 8)
      .addButton(8, 2, 0, "VALUE_A", widgets.UIField.STYLE_E, 8)
      .breakLine()

      .addColGap(w)
      .addButton(4, 2, 0, "OPTIONS_KEYMAP_CANCEL", widgets.UIField.STYLE_SW, 8)
      .addButton(8, 2, 0, "VALUE_C", widgets.UIField.STYLE_ES, 8)
      .breakLine()

      // -------------------------------------------------------

      .addRowGap(2)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(5, 2, 0, "OPTIONS_KEYMAP_GOBACK", widgets.UIField.STYLE_NORMAL, 8, function () {
        inputDto.save();
        this.changeState("OPTIONS");
      })
      .addColGap(2)
      .addButton(5, 2, 0, "OPTIONS_KEYMAP_SET", widgets.UIField.STYLE_NORMAL, 8, function () {

        // setup generic input request
        input.genericInput = true;
        index = (exports.mode === 0)? 0 : 4;
      });
  }
};