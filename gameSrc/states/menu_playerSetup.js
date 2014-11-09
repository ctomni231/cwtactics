"use strict";

var constants = require("../constants");
var widgets = require("../gui");

var roundDTO = require("../dataTransfer/roundSetup");

var model = require("../model");
var i18n = require("../localization");
var sheets = require("../sheets");

var TEAM_IDENTIFIERS = [
  "A", "B", "C", "D"
];

var selectedSlot = 0;
var gameModeBtn;
var playerNameBtn;
var playerTeamBtn;
var playerTypeBtn;
var playerCo_A_Btn;

var updateGameModeBtn = function () {
  gameModeBtn.text = (model.gameMode === model.GAME_MODE_AW1) ? "Advance Wars 1" : "Advance Wars 2";
};

var selectSlot = function (i) {
  selectedSlot = i;
  updateSlotButtons();
};

var updateSlotButtons = function () {
  var i = selectedSlot;

  if (roundDTO.type[i] === constants.INACTIVE) {
    playerTypeBtn.text = "config.player.off";
  } else if (roundDTO.type[i] === constants.DESELECT_ID) {
    playerTypeBtn.text = "config.player.disabled";
  } else if (roundDTO.type[i] === 0) {
    playerTypeBtn.text = "config.player.human";
  } else {
    playerTypeBtn.text = "config.player.AI";
  }
  playerTypeBtn.text = i18n.forKey(playerTypeBtn.text);

  if (roundDTO.type[i] === constants.DESELECT_ID) {
    playerNameBtn.text = "Slot " + (i + 1);
    playerTeamBtn.text = "";
    playerCo_A_Btn.text = "";

  } else {
    playerNameBtn.text = "Player " + (i + 1);
    playerTeamBtn.text = TEAM_IDENTIFIERS[roundDTO.team[i]];

    if (roundDTO.co[i] === constants.INACTIVE) {
      playerCo_A_Btn.text = i18n.forKey("config.player.commanders.none");
    } else {
      playerCo_A_Btn.text = sheets.commanders.types[roundDTO.co[i]];
    }
  }

};

var changeValue = function (type, isPrev) {
  roundDTO.changeParameter(selectedSlot, type, isPrev);
  updateSlotButtons();
};

exports.state = {

  id: "PLAYER_SETUP_SCREEN",

  enter: function () {
    roundDTO.preProcess();
    selectSlot(0);
    updateGameModeBtn();
  },

  init: function (layout) {
    var h = parseInt((constants.SCREEN_HEIGHT - 20) / 2, 10);
    var w = parseInt((constants.SCREEN_WIDTH - 18) / 2, 10);

    layout

      .addRowGap(h)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(2, 2, 0, "MENU_LEFT", widgets.UIField.STYLE_NSW, 8, function () {
        changeValue(roundDTO.CHANGE_TYPE.GAME_TYPE, false);
        updateGameModeBtn();

      })
      .addButton(7, 2, 0, "PLAYER_CONFIG_GAMEMODE", widgets.UIField.STYLE_NS, 8)
      .addButton(7, 2, 0, "PLAYER_CONFIG_GAMEMODE_VALUE", widgets.UIField.STYLE_NS, 8)
      .addButton(2, 2, 0, "MENU_RIGHT", widgets.UIField.STYLE_NES, 8, function () {
        changeValue(roundDTO.CHANGE_TYPE.GAME_TYPE, true);
        updateGameModeBtn();
      })
      .breakLine()

      // -------------------------------------------------------

      .addRowGap(2)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(1, 2, 0, "", widgets.UIField.STYLE_NSW, 8)
      .addButton(4, 2, 0, "PLAYER_CONFIG_SLOT1", widgets.UIField.STYLE_NS, 8, function () {
        selectSlot(0);
      })
      .addButton(4, 2, 0, "PLAYER_CONFIG_SLOT2", widgets.UIField.STYLE_NS, 8, function () {
        selectSlot(1);
      })
      .addButton(4, 2, 0, "PLAYER_CONFIG_SLOT3", widgets.UIField.STYLE_NS, 8, function () {
        selectSlot(2);
      })
      .addButton(4, 2, 0, "PLAYER_CONFIG_SLOT4", widgets.UIField.STYLE_NS, 8, function () {
        selectSlot(3);
      })
      .addButton(1, 2, 0, "", widgets.UIField.STYLE_NES, 8)
      .breakLine()

      // -------------------------------------------------------

      .addRowGap(2)
      // -------------------------------------------------------

      .addColGap(w+3)
      .addButton(6, 2, 0, "PLAYER_CONFIG_NAME", widgets.UIField.STYLE_NW, 8)
      .addButton(6, 2, 0, "PLAYER_CONFIG_NAME_VALUE", widgets.UIField.STYLE_NE, 8)
      //.addColGap(2)
      //.addButton(2, 2, 0, "MENU_LEFT", cwt.UIField.STYLE_NSW, 8, function () {})
      //.addButton(2, 2, 0, "MENU_RIGHT", cwt.UIField.STYLE_NES, 8, function () {})
      .breakLine()

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(2, 2, 0, "MENU_LEFT", widgets.UIField.STYLE_NEW, 8, function () {
        changeValue(roundDTO.CHANGE_TYPE.PLAYER_TYPE, false);
      })
      .addColGap(1)
      .addButton(6, 2, 0, "PLAYER_CONFIG_TYPE", widgets.UIField.STYLE_W, 8)
      .addButton(6, 2, 0, "PLAYER_CONFIG_TYPE_VALUE", widgets.UIField.STYLE_E, 8)
      .addColGap(1)
      .addButton(2, 2, 0, "MENU_RIGHT", widgets.UIField.STYLE_NEW, 8, function () {
        changeValue(roundDTO.CHANGE_TYPE.PLAYER_TYPE, true);
      })
      .breakLine()

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(2, 2, 0, "MENU_LEFT", widgets.UIField.STYLE_EW, 8, function () {
        changeValue(roundDTO.CHANGE_TYPE.TEAM, false);
      })
      .addColGap(1)
      .addButton(6, 2, 0, "PLAYER_CONFIG_TEAM", widgets.UIField.STYLE_W, 8)
      .addButton(6, 2, 0, "PLAYER_CONFIG_TEAM_VALUE", widgets.UIField.STYLE_E, 8)
      .addColGap(1)
      .addButton(2, 2, 0, "MENU_RIGHT", widgets.UIField.STYLE_EW, 8, function () {
        changeValue(roundDTO.CHANGE_TYPE.TEAM, true);
      })
      .breakLine()

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(2, 2, 0, "MENU_LEFT", widgets.UIField.STYLE_ESW, 8, function () {
        changeValue(roundDTO.CHANGE_TYPE.CO_MAIN, true);
      })
      .addColGap(1)
      .addButton(6, 2, 0, "PLAYER_CONFIG_CO_A", widgets.UIField.STYLE_SW, 8)
      .addButton(6, 2, 0, "PLAYER_CONFIG_CO_A_VALUE", widgets.UIField.STYLE_ES, 8)
      .addColGap(1)
      .addButton(2, 2, 0, "MENU_RIGHT", widgets.UIField.STYLE_ESW, 8, function () {
        changeValue(roundDTO.CHANGE_TYPE.CO_MAIN, false);
      })
      .breakLine()

      // -------------------------------------------------------

      .addRowGap(2)

      .addColGap(w)
      .addButton(5, 2, 0, "MENU_BACK", widgets.UIField.STYLE_NORMAL, 8, function () {
        this.changeState("VERSUS");
      })

      .addColGap(8)
      .addButton(5, 2, 0, "MENU_NEXT", widgets.UIField.STYLE_NORMAL, 8, function () {
        this.changeState("PARAMETER_SETUP_SCREEN");
      })
      .breakLine();


    gameModeBtn = layout.getButtonByKey("PLAYER_CONFIG_GAMEMODE_VALUE");
    playerNameBtn = layout.getButtonByKey("PLAYER_CONFIG_NAME_VALUE");
    playerTeamBtn = layout.getButtonByKey("PLAYER_CONFIG_TEAM_VALUE");
    playerTypeBtn = layout.getButtonByKey("PLAYER_CONFIG_TYPE_VALUE");
    playerCo_A_Btn = layout.getButtonByKey("PLAYER_CONFIG_CO_A_VALUE");
  }
};