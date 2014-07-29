require("../statemachine").addMenuState({

  id: "PLAYER_SETUP_SCREEN",
  last: "VERSUS",

  enter: function () {
    cwt.GameSelectionDTO.preProcess();
    this.selectSlot(0);
    this.updateGameModeBtn();
  },

  init: function (layout) {

    var TEAM_IDENTIFIERS = [
      "A", "B", "C", "D"
    ];

    this.selectedSlot = 0;

    var gameModeBtn;
    var playerNameBtn;
    var playerTeamBtn;
    var playerTypeBtn;
    var playerCo_A_Btn;

    this.updateGameModeBtn = function () {
      gameModeBtn.text = (cwt.Gameround.gameMode === cwt.Gameround.GAME_MODE_AW1) ? "Advance Wars 1" : "Advance Wars 2";
    };

    this.selectSlot = (function (i) {
      this.selectedSlot = i;
      updateSlotButtons();
    }).bind(this);

    var updateSlotButtons = (function () {
      var i = this.selectedSlot;

      if (cwt.GameSelectionDTO.type[i] === cwt.INACTIVE) {
        playerTypeBtn.text = "config.player.off";
      } else if (cwt.GameSelectionDTO.type[i] === cwt.DESELECT_ID) {
        playerTypeBtn.text = "config.player.disabled";
      } else if (cwt.GameSelectionDTO.type[i] === 0) {
        playerTypeBtn.text = "config.player.human";
      } else {
        playerTypeBtn.text = "config.player.AI";
      }
      playerTypeBtn.text = cwt.Localization.forKey(playerTypeBtn.text);

      if (cwt.GameSelectionDTO.type[i] === cwt.DESELECT_ID) {
        playerNameBtn.text = "Slot " + (i + 1);
        playerTeamBtn.text = "";
        playerCo_A_Btn.text = "";

      } else {
        playerNameBtn.text = "Player " + (i + 1);
        playerTeamBtn.text = TEAM_IDENTIFIERS[cwt.GameSelectionDTO.team[i]];

        if (cwt.GameSelectionDTO.commanders[i] === cwt.INACTIVE) {
          playerCo_A_Btn.text = cwt.Localization.forKey("config.player.commanders.none");
        } else {
          playerCo_A_Btn.text = cwt.CoSheet.types[cwt.GameSelectionDTO.commanders[i]];
        }
      }

    }).bind(this);

    var changeValue = (function (type, isPrev) {
      cwt.GameSelectionDTO.changeParameter(this.selectedSlot, type, isPrev);
      updateSlotButtons();
    }).bind(this);

    var h = parseInt((cwt.SCREEN_HEIGHT - 20) / 2, 10);
    var w = parseInt((cwt.SCREEN_WIDTH - 18) / 2, 10);

    layout

      .addRowGap(h)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(2, 2, 0, "MENU_LEFT", cwt.UIField.STYLE_NSW, 8, function () {
        changeValue(cwt.GameSelectionDTO.CHANGE_TYPE.GAME_TYPE, false);
        this.updateGameModeBtn();

      })
      .addButton(7, 2, 0, "PLAYER_CONFIG_GAMEMODE", cwt.UIField.STYLE_NS, 8)
      .addButton(7, 2, 0, "PLAYER_CONFIG_GAMEMODE_VALUE", cwt.UIField.STYLE_NS, 8)
      .addButton(2, 2, 0, "MENU_RIGHT", cwt.UIField.STYLE_NES, 8, function () {
        changeValue(cwt.GameSelectionDTO.CHANGE_TYPE.GAME_TYPE, true);
        this.updateGameModeBtn();
      })
      .breakLine()

      // -------------------------------------------------------

      .addRowGap(2)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(1, 2, 0, "", cwt.UIField.STYLE_NSW, 8)
      .addButton(4, 2, 0, "PLAYER_CONFIG_SLOT1", cwt.UIField.STYLE_NS, 8, function () {
        this.selectSlot(0);
      })
      .addButton(4, 2, 0, "PLAYER_CONFIG_SLOT2", cwt.UIField.STYLE_NS, 8, function () {
        this.selectSlot(1);
      })
      .addButton(4, 2, 0, "PLAYER_CONFIG_SLOT3", cwt.UIField.STYLE_NS, 8, function () {
        this.selectSlot(2);
      })
      .addButton(4, 2, 0, "PLAYER_CONFIG_SLOT4", cwt.UIField.STYLE_NS, 8, function () {
        this.selectSlot(3);
      })
      .addButton(1, 2, 0, "", cwt.UIField.STYLE_NES, 8)
      .breakLine()

      // -------------------------------------------------------

      .addRowGap(2)
      // -------------------------------------------------------

      .addColGap(w+3)
      .addButton(6, 2, 0, "PLAYER_CONFIG_NAME", cwt.UIField.STYLE_NW, 8)
      .addButton(6, 2, 0, "PLAYER_CONFIG_NAME_VALUE", cwt.UIField.STYLE_NE, 8)
      //.addColGap(2)
      //.addButton(2, 2, 0, "MENU_LEFT", cwt.UIField.STYLE_NSW, 8, function () {})
      //.addButton(2, 2, 0, "MENU_RIGHT", cwt.UIField.STYLE_NES, 8, function () {})
      .breakLine()

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(2, 2, 0, "MENU_LEFT", cwt.UIField.STYLE_NEW, 8, function () {
        changeValue(cwt.GameSelectionDTO.CHANGE_TYPE.PLAYER_TYPE, false);
      })
      .addColGap(1)
      .addButton(6, 2, 0, "PLAYER_CONFIG_TYPE", cwt.UIField.STYLE_W, 8)
      .addButton(6, 2, 0, "PLAYER_CONFIG_TYPE_VALUE", cwt.UIField.STYLE_E, 8)
      .addColGap(1)
      .addButton(2, 2, 0, "MENU_RIGHT", cwt.UIField.STYLE_NEW, 8, function () {
        changeValue(cwt.GameSelectionDTO.CHANGE_TYPE.PLAYER_TYPE, true);
      })
      .breakLine()

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(2, 2, 0, "MENU_LEFT", cwt.UIField.STYLE_EW, 8, function () {
        changeValue(cwt.GameSelectionDTO.CHANGE_TYPE.TEAM, false);
      })
      .addColGap(1)
      .addButton(6, 2, 0, "PLAYER_CONFIG_TEAM", cwt.UIField.STYLE_W, 8)
      .addButton(6, 2, 0, "PLAYER_CONFIG_TEAM_VALUE", cwt.UIField.STYLE_E, 8)
      .addColGap(1)
      .addButton(2, 2, 0, "MENU_RIGHT", cwt.UIField.STYLE_EW, 8, function () {
        changeValue(cwt.GameSelectionDTO.CHANGE_TYPE.TEAM, true);
      })
      .breakLine()

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(2, 2, 0, "MENU_LEFT", cwt.UIField.STYLE_ESW, 8, function () {
        changeValue(cwt.GameSelectionDTO.CHANGE_TYPE.CO_MAIN, true);
      })
      .addColGap(1)
      .addButton(6, 2, 0, "PLAYER_CONFIG_CO_A", cwt.UIField.STYLE_SW, 8)
      .addButton(6, 2, 0, "PLAYER_CONFIG_CO_A_VALUE", cwt.UIField.STYLE_ES, 8)
      .addColGap(1)
      .addButton(2, 2, 0, "MENU_RIGHT", cwt.UIField.STYLE_ESW, 8, function () {
        changeValue(cwt.GameSelectionDTO.CHANGE_TYPE.CO_MAIN, false);
      })
      .breakLine()

      // -------------------------------------------------------

      .addRowGap(2)

      .addColGap(w)
      .addButton(5, 2, 0, "MENU_BACK", cwt.UIField.STYLE_NORMAL, 8, function () {
        require("../statemachine").changeState("VERSUS");
      })

      .addColGap(8)
      .addButton(5, 2, 0, "MENU_NEXT", cwt.UIField.STYLE_NORMAL, 8, function () {
        require("../statemachine").changeState("PARAMETER_SETUP_SCREEN");
      })
      .breakLine();


    var gameModeBtn = this.gameModeBtn = layout.getButtonByKey("PLAYER_CONFIG_GAMEMODE_VALUE");
    var playerNameBtn = this.playerNameBtn = layout.getButtonByKey("PLAYER_CONFIG_NAME_VALUE");
    var playerTeamBtn = this.playerTeamBtn = layout.getButtonByKey("PLAYER_CONFIG_TEAM_VALUE");
    var playerTypeBtn = this.playerTypeBtn = layout.getButtonByKey("PLAYER_CONFIG_TYPE_VALUE");
    var playerCo_A_Btn = this.playerCo_A_Btn = layout.getButtonByKey("PLAYER_CONFIG_CO_A_VALUE");
  }
});