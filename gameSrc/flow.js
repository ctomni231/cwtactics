"use strict";

cwt.Gameflow.addState({
  id: "ERROR_SCREEN",

  init: function () {
    this.activeCmd = 0;
    this.message = null;
    this.where = null;
  },

  enter: function () {
    this.rendered = false;
    this.activeCmd = 0;
    this.message = null;
    this.where = null;
  },

  update: function (delta, lastInput) {
    switch (lastInput) {

      case cwt.Input.TYPE_LEFT:
        if (this.activeCmd > 0) {
          this.activeCmd--;
        }
        break;

      case cwt.Input.TYPE_RIGHT:
        if (this.activeCmd < 2) {
          this.activeCmd++;
        }
        break;

      case cwt.Input.TYPE_ACTION :
        switch (this.activeCmd) {

          /* Restart */
          case 0:
            break;

          /* Wipe-Out Content and restart*/
          case 1:
            break;

          /* Send report and restart */
          case 2:
            break;
        }
        break;
    }
  },

  render: function (delta) {
    if (!this.rendered) {
      var ctxUI = cwt.Screen.layerUI.getContext();
      this.rendered = true;
    }
  }
});

cwt.Gameflow.addState({
  id: "PORTRAIT_SCREEN",

  init: function () {
    this.lastStateId = null;
  },

  enter: function (lastState) {
    this.rendered = false;
  },

  update: function (delta, lastInput) {
    var isLandscape = false;

    // go back to the last state when the device
    // is back in landscape mode (don't fire enter
    // event when changing back to the last state)
    if (isLandscape) {
      cwt.Gameflow.setState(this.lastStateId, false);
      this.lastStateId = null;
    }
  },

  render: function (delta) {
    if (!this.rendered) {
      var ctxUI = cwt.Screen.interfaceLayer.getContext();

      cwt.DrawUtil.cleanContext(ctxUI);

      this.rendered = true;
    }
  }
});
cwt.Gameflow.addState({
  id: "LOADING_SCREEN",

  init: function () {
    this.bar = new cwt.LoadingBar(10, parseInt(cwt.Screen.height / 2, 10) - 10, cwt.Screen.width - 20, 20);
  },

  enter: function () {
    this.done = false;

    var bar = this.bar;
    cwt.Loading.startProcess(bar, function () {
      bar.setPercentage(100);
    });
  },

  update: function (delta, lastInput) {
    if (this.done) {

      // push event
      (cwt.createModuleCaller("$afterLoad"))();

      cwt.Gameflow.changeState("START_SCREEN");
    } else if (this.bar.process === 100) {
      this.done = true;
    }
  },

  render: function (delta) {
    var ctx = cwt.Screen.layerUI.getContext();

    this.bar.draw(ctx);
  }
});
cwt.Gameflow.addState({
  id: "NONE",

  init: function () {
    this.backgroundDrawn = false;
  },

  update: function (delta) {
    if (this.backgroundDrawn) {
      cwt.Gameflow.changeState("LOADING_SCREEN");
    }
  },

  render: function () {
    if (!this.backgroundDrawn) {
      var ctx = cwt.Screen.layerBG.getContext();

      ctx.fillStyle = "grey";
      ctx.fillRect(0, 0, cwt.Screen.width, cwt.Screen.height);

      this.backgroundDrawn = true;
    }
  }
});
cwt.Gameflow.addState({
  id: "START_SCREEN",

  init: function () {
    this.TOOLTIP_TIME = 10000;
    this.tooltip_time = this.TOOLTIP_TIME;

    /**
     * @type {HTMLCanvasElement|HTMLImageElement|null}
     */
    this.background = null;

    this.tooltip = new cwt.UIField(
      parseInt(cwt.Screen.width * 0.1, 10),
      parseInt(cwt.Screen.height * 0.2, 10),
      parseInt(cwt.Screen.width * 0.8, 10),
      120,
      "",
      10,
      cwt.UIField.STYLE_NORMAL
    );

    this.button = new cwt.UIField(
      parseInt(cwt.Screen.width * 0.5 - 150, 10),
      parseInt(cwt.Screen.height * 0.8, 10) - 20,
      300,
      40,
      "START",
      20,
      cwt.UIField.STYLE_NORMAL
    );
  },

  enter: function () {
    cwt.Screen.layerUI.clear();

    var numBackgrounds = cwt.Image.sprites.BACKGROUNDS.getNumberOfImages();
    var randBGIndex = parseInt(Math.random() * numBackgrounds, 10);

    this.background = cwt.Image.sprites.BACKGROUNDS.getImage(randBGIndex);
  },

  update: function (delta, lastInput) {

    // action leads into main menu
    if (lastInput && lastInput.key === cwt.Input.TYPE_ACTION) {
      cwt.Audio.playNullSound();
      cwt.Gameflow.changeState("MAIN_MENU");

    } else {
      this.tooltip_time += delta;
      if (this.tooltip_time >= this.TOOLTIP_TIME) {

        // update random tooltip
        var randEl = cwt.Tooltips[parseInt(Math.random() * cwt.Tooltips.length, 10)];
        this.tooltip.text = cwt.Localization.forKey(randEl);

        if (this.tooltip.text.search(/\n/) !== -1) {
          this.tooltip.text = this.tooltip.text.split("\n");
        }

        this.tooltip_time = 0;
      }
    }
  },

  render: function () {
    if (this.background) {
      cwt.Screen.layerBG.getContext().drawImage(
        this.background,
        0, 0,
        cwt.Screen.width,
        cwt.Screen.height
      );

      this.background = null;
    }

    this.button.draw(cwt.Screen.layerUI.getContext());
    this.tooltip.draw(cwt.Screen.layerUI.getContext());
  }
});

cwt.Gameflow.addMenuState({

  id: "MAIN_MENU",

  last: "START_SCREEN",

  doLayout: function (layout) {
    var h = parseInt((cwt.SCREEN_HEIGHT - 22) / 2, 10);
    var w = parseInt((cwt.SCREEN_WIDTH - 16) / 2, 10);

    layout

      .addRowGap(h)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(16, 4, 0, "MAIN_MENU_SKIRMISH", cwt.UIField.STYLE_NORMAL, 20, function () {
        cwt.Gameflow.changeState("VERSUS");
      })
      .breakLine()

      // -------------------------------------------------------

      .addRowGap(2)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(16, 4, 0, "MAIN_MENU_NETWORK", cwt.UIField.STYLE_NORMAL, 20)
      .breakLine()

      //--------------------------------------------------------

      .addRowGap(1)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(16, 3, 0, "MAIN_MENU_TEST_WEATHER", cwt.UIField.STYLE_NEW, 20, function () {
        cwt.Gameflow.changeState("WEATHER");
      })
      .breakLine()
      .addColGap(w)
      .addButton(16, 3, 0, "MAIN_MENU_TEST_WEATHER", cwt.UIField.STYLE_ESW, 20, function () {
        cwt.Gameflow.changeState("RAIN");
      })
      .breakLine()

      // -------------------------------------------------------

      .addRowGap(1)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(16, 4, 0, "MAIN_MENU_OPTIONS", cwt.UIField.STYLE_NORMAL, 20, function () {
        cwt.Gameflow.changeState("OPTIONS");
      });
  }
});
cwt.Gameflow.addMenuState({

  id: "PARAMETER_SETUP_SCREEN",
  last: "PLAYER_SETUP_SCREEN",

  init: function (layout) {
    var ENTRIES_PARAMETERS = 6;

    var state = this;

    state.configAttrPage = new cwt.Pagination(cwt.Config.MULTITON_NAMES, ENTRIES_PARAMETERS, function () {
      for (var i = 0, e = this.entries.length; i < e; i++) {
        state.names()[i].text = (this.entries[i]) ? cwt.Localization.forKey(this.entries[i]) : "";
        state.values()[i].text = (this.entries[i]) ? cwt.Config.getValue(this.entries[i]).toString() : "";
      }
      state.pageButton().text = this.page.toString();
    });

    state.pageButton = cwt.lazy(function () {
      return layout.getButtonByKey("PARAMETER_CONFIG_PAGE");
    });

    state.changeConfigValue = function (index, left) {
      if (state.configAttrPage.entries[index]) {
        var name = state.configAttrPage.entries[index];
        var cfg = cwt.Config.getConfig(name);

        if (left) {
          cfg.decreaseValue();
        } else {
          cfg.increaseValue();
        }

        state.values()[index].text = cwt.Config.getValue(name).toString();
      }
    };

    state.names = cwt.lazy(function () {
      return layout.getButtonsByReg(/(PARAMETER_CONFIG_)(\d+)$/);
    });

    state.values = cwt.lazy(function () {
      return layout.getButtonsByReg(/(PARAMETER_CONFIG_)(\d+)(_VALUE)$/);
    });
  },

  enter: function () {
    this.configAttrPage.selectPage(0);
  },

  doLayout: function (layout) {
    var ENTRIES_PARAMETERS = 6;

    var h = parseInt((cwt.SCREEN_HEIGHT - (8 + (ENTRIES_PARAMETERS * 2))) / 2, 10);
    var w = parseInt((cwt.SCREEN_WIDTH - 18) / 2, 10);

    layout
      .addRowGap(h)

      // -------------------------------------------------------

      .repeat(ENTRIES_PARAMETERS, function (i) {
        var style1, style2, style3;

        if (i === 0) {
          style1 = cwt.UIField.STYLE_NEW;
          style2 = cwt.UIField.STYLE_NW;
          style3 = cwt.UIField.STYLE_NE;
        } else if (i === ENTRIES_PARAMETERS - 1) {
          style1 = cwt.UIField.STYLE_ESW;
          style2 = cwt.UIField.STYLE_SW;
          style3 = cwt.UIField.STYLE_ES;
        } else {
          style1 = cwt.UIField.STYLE_EW;
          style2 = cwt.UIField.STYLE_W;
          style3 = cwt.UIField.STYLE_E;
        }

        this
          .addColGap(w)
          .addButton(2, 2, 0, "MENU_LEFT", style1, 8, function () {
            this.changeConfigValue(i, true);
          })
          .addColGap(1)
          .addButton(8, 2, 0, "PARAMETER_CONFIG_" + i, style2, 8)
          .addButton(4, 2, 0, "PARAMETER_CONFIG_" + i + "_VALUE", style3, 8)
          .addColGap(1)
          .addButton(2, 2, 0, "MENU_RIGHT", style1, 8, function () {
            this.changeConfigValue(i, false);
          })
          .breakLine()
      })

      // -------------------------------------------------------

      .addRowGap(1)

      // -------------------------------------------------------

      .addColGap(w + 6)
      .addButton(2, 2, 0, "MENU_LEFT", cwt.UIField.STYLE_NSW, 8, function () {
        this.configAttrPage.selectPage(this.configAttrPage.page - 1);
      })
      .addButton(2, 2, 0, "PARAMETER_CONFIG_PAGE", cwt.UIField.STYLE_NS, 8)
      .addButton(2, 2, 0, "MENU_RIGHT", cwt.UIField.STYLE_NES, 8, function () {
        this.configAttrPage.selectPage(this.configAttrPage.page + 1);
      })
      .breakLine()

      // -------------------------------------------------------

      .addRowGap(3)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(5, 2, 0, "MENU_BACK", cwt.UIField.STYLE_NORMAL, 8, function () {
        cwt.Gameflow.changeState("PLAYER_SETUP_SCREEN");
      })
      .addColGap(8)
      .addButton(5, 2, 0, "MENU_NEXT", cwt.UIField.STYLE_NORMAL, 8, function () {
        cwt.Gameflow.changeState("INGAME_ENTER");
      })
      .breakLine();
  }
});
cwt.Gameflow.addMenuState({

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

        if (cwt.GameSelectionDTO.co[i] === cwt.INACTIVE) {
          playerCo_A_Btn.text = cwt.Localization.forKey("config.player.co.none");
        } else {
          playerCo_A_Btn.text = cwt.CoSheet.types[cwt.GameSelectionDTO.co[i]];
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

      .addColGap(w + 3)
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
        cwt.Gameflow.changeState("VERSUS");
      })

      .addColGap(8)
      .addButton(5, 2, 0, "MENU_NEXT", cwt.UIField.STYLE_NORMAL, 8, function () {
        cwt.Gameflow.changeState("PARAMETER_SETUP_SCREEN");
      })
      .breakLine();


    var gameModeBtn = this.gameModeBtn = layout.getButtonByKey("PLAYER_CONFIG_GAMEMODE_VALUE");
    var playerNameBtn = this.playerNameBtn = layout.getButtonByKey("PLAYER_CONFIG_NAME_VALUE");
    var playerTeamBtn = this.playerTeamBtn = layout.getButtonByKey("PLAYER_CONFIG_TEAM_VALUE");
    var playerTypeBtn = this.playerTypeBtn = layout.getButtonByKey("PLAYER_CONFIG_TYPE_VALUE");
    var playerCo_A_Btn = this.playerCo_A_Btn = layout.getButtonByKey("PLAYER_CONFIG_CO_A_VALUE");
  }
});
cwt.Gameflow.addMenuState({

  id: "VERSUS",
  last: "MAIN_MENU",

  enter: function () {
    this.selectedMap = null;
    this.selectPage(0);
    this.layout.getButtonByKey("MAP_SELECT_NAME").text = "";
  },

  init: function (layout) {

    var MAP_LIST_SIZE = 7;

    var h = parseInt((cwt.SCREEN_HEIGHT - 22) / 2, 10);
    var w = parseInt((cwt.SCREEN_WIDTH - 18) / 2, 10);
    var state = this;

    var cPage = 0;

    var buttonList;
    var mapList = [
      null, null, null, null, null, null, null
    ];

    var selectPage = this.selectPage = function (i) {
      if (i < 0 || (i * MAP_LIST_SIZE) >= cwt.Maps.maps.length) {
        return;
      }

      layout.getButtonByKey("MAP_SELECT_PAGE").text = (i + 1).toString();

      i = (i * MAP_LIST_SIZE);
      for (var n = 0; n < MAP_LIST_SIZE; n++) {
        if (i + n >= cwt.Maps.maps.length) {
          buttonList[n].text = "";
          mapList[n] = null;
        } else {
          var map = cwt.Maps.maps[i + n];
          buttonList[n].text = map;
          mapList[n] = map;
        }
      }
    };

    var selectMapCallback_ = function (obj) {
      state.selectedMap = obj.value;
      state.rendered = false;
      layout.getButtonByKey("MAP_SELECT_NAME").text = obj.key;
      cwt.Input.releaseBlock();
    };

    var selectMap = function (index) {
      if (!mapList[index]) {
        return;
      }

      cwt.Input.requestBlock();
      cwt.Storage.mapStorage.get(mapList[index], selectMapCallback_);
    };

    layout

      .addRowGap(h)

      // -------------------------------------------------------

      .addColGap(w)

      .addButton(2, 2, 0, "MAP_SELECT_PAGE_LEFT", cwt.UIField.STYLE_NW, 8, function () {
      })
      .addButton(3, 2, 0, "MAP_SELECT_PAGE", cwt.UIField.STYLE_N, 8)
      .addButton(2, 2, 0, "MAP_SELECT_PAGE_RIGHT", cwt.UIField.STYLE_NE, 8, function () {
      })

      .addColGap(4)
      .addButton(8, 2, 0, "MAP_SELECT_NAME", cwt.UIField.STYLE_NORMAL, 8)
      .breakLine()

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(7, 2, 0, "MAP_SELECT_1", cwt.UIField.STYLE_EW, 8, function () {
        selectMap(0);
      })

      .addColGap(1)

      // map preview canvas
      .addCustomField(10, 10, 0, "MAP_SELECT_PREVIEW", function (ctx) {
        ctx.clearRect(this.x, this.y, this.width, this.height);

        if (state.selectedMap) {
          var BASE = (state.selectedMap.mpw >= cwt.MAX_MAP_WIDTH / 2) ? 2 : 4;

          var miniMapImg = cwt.Image.sprites.MINIMAP.getImage(
            BASE === 2 ? cwt.Sprite.MINIMAP_2x2 : cwt.Sprite.MINIMAP_4x4);

          var map = state.selectedMap.map;
          var typeMap = state.selectedMap.typeMap;
          var xe = state.selectedMap.mpw;
          var ye = state.selectedMap.mph;
          var startX = this.x + parseInt(this.width / 2, 10) - parseInt(state.selectedMap.mpw / 2 * BASE, 10);
          var startY = this.y + parseInt(this.height / 2, 10) - parseInt(state.selectedMap.mph / 2 * BASE, 10);

          for (var x = 0; x < xe; x++) {
            for (var y = 0; y < ye; y++) {

              // 3.1. tiles first
              var type = typeMap[ map[x][y] ];
              if (cwt.MiniMapIndexes[type] !== void 0) {

                ctx.drawImage(
                  miniMapImg,
                  cwt.MiniMapIndexes[type] * BASE, 0,
                  BASE, BASE,
                  startX + (x * BASE),
                  startY + (y * BASE),
                  BASE, BASE
                );

              } else {
                ctx.fillStyle = "#FF0000";
                ctx.fillRect(x * BASE, y * BASE, BASE, BASE);
              }

            }
          }
        }
      }, true)
      .breakLine()

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(7, 2, 0, "MAP_SELECT_2", cwt.UIField.STYLE_EW, 8, function () {
        selectMap(1);
      })
      .breakLine()

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(7, 2, 0, "MAP_SELECT_3", cwt.UIField.STYLE_EW, 8, function () {
        selectMap(2);
      })
      .breakLine()

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(7, 2, 0, "MAP_SELECT_4", cwt.UIField.STYLE_EW, 8, function () {
        selectMap(3);
      })
      .breakLine()

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(7, 2, 0, "MAP_SELECT_5", cwt.UIField.STYLE_EW, 8, function () {
        selectMap(4);
      })
      .breakLine()

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(7, 2, 0, "MAP_SELECT_6", cwt.UIField.STYLE_EW, 8, function () {
        selectMap(5);
      })
      .addColGap(1)
      .addCustomField(2, 4, 0, "MAP_SELECT_PREVIEW_1", function () {
      }, true)
      .addCustomField(2, 4, 0, "MAP_SELECT_PREVIEW_2", function () {
      }, true)
      .addCustomField(2, 4, 0, "MAP_SELECT_PREVIEW_3", function () {
      }, true)
      .addCustomField(2, 4, 0, "MAP_SELECT_PREVIEW_4", function () {
      }, true)
      .addCustomField(2, 4, 0, "MAP_SELECT_PREVIEW_5", function () {
      }, true)
      .breakLine()

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(7, 2, 0, "MAP_SELECT_7", cwt.UIField.STYLE_ESW, 8, function () {
        selectMap(6);
      })
      .breakLine()

      // -------------------------------------------------------

      .addRowGap(2)

      .addColGap(w)
      .addButton(5, 2, 0, "MENU_BACK", cwt.UIField.STYLE_NORMAL, 8, function () {
        cwt.Gameflow.changeState("MAIN_MENU");
      })

      .addColGap(5)
      .addButton(8, 2, 0, "MENU_CONFIGURED_MATCH", cwt.UIField.STYLE_NEW, 8, function () {
        cwt.GameSelectionDTO.map = this.selectedMap;
        this.selectedMap = null;
        cwt.Gameflow.changeState("PLAYER_SETUP_SCREEN");
      })
      .breakLine()

      .addColGap(w + 10)
      .addButton(8, 2, 0, "MENU_FAST_MATCH", cwt.UIField.STYLE_ESW, 8, function () {
        // cwt.Gameflow.changeState("PLAYER_SETUP_SCREEN");
      });

    buttonList = [
      layout.getButtonByKey("MAP_SELECT_1"),
      layout.getButtonByKey("MAP_SELECT_2"),
      layout.getButtonByKey("MAP_SELECT_3"),
      layout.getButtonByKey("MAP_SELECT_4"),
      layout.getButtonByKey("MAP_SELECT_5"),
      layout.getButtonByKey("MAP_SELECT_6"),
      layout.getButtonByKey("MAP_SELECT_7")
    ];
  }
});
cwt.Gameflow.addMenuState({

  id: "CONFIRM_WIPE_OUT_SCREEN",

  last: "OPTIONS",

  init: function (layout) {

    var h = parseInt((cwt.SCREEN_HEIGHT - 18) / 2, 10);
    var w = parseInt((cwt.SCREEN_WIDTH - 16) / 2, 10);

    layout

      .addRowGap(h)

      // -------------------------------------------------------

      .addColGap(w).addButton(16, 8, 0, "OPTIONS_WIPE_OUT_TEXT", cwt.UIField.STYLE_NORMAL, 8)
      .breakLine()

      // -------------------------------------------------------

      .addRowGap(2)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(6, 2, 0, "OPTIONS_WIPE_OUT_NO", cwt.UIField.STYLE_NORMAL, function () {
        cwt.Gameflow.changeState("OPTIONS");
      })
      .addColGap(4)
      .addButton(6, 2, 0, "OPTIONS_WIPE_OUT_YES", cwt.UIField.STYLE_NORMAL, function () {
        cwt.Storage.wipeOutAll(function () {
          delete localStorage.cwt_hasCache;
          document.location.reload();
        });
      });
  }
});
cwt.Gameflow.addMenuState({

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

    var updateSound = function (isSFX, change, state) {
      var vol = ((isSFX) ? cwt.Audio.getSfxVolume() : cwt.Audio.getMusicVolume()) + change;
      (isSFX) ? cwt.Audio.setSfxVolume(vol) : cwt.Audio.setMusicVolume(vol);
      ((isSFX) ? sfxButton : musicButton).text = Math.round(vol * 100).toString();
      state.rendered = false;
    }

    layout

      .addRowGap(h)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(4, 2, 0, "OPTIONS_SFX_VOL_DOWN", cwt.UIField.STYLE_NW, function () {
        updateSound(true, -0.05, this);
      })
      .addButton(8, 2, 0, "OPTIONS_SFX_VOL", cwt.UIField.STYLE_N, 8)
      .addButton(4, 2, 0, "OPTIONS_SFX_VOL_UP", cwt.UIField.STYLE_NE, function () {
        updateSound(true, +0.05, this);
      })
      .breakLine()

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(4, 2, 0, "OPTIONS_MUSIC_VOL_DOWN", cwt.UIField.STYLE_SW, function () {
        updateSound(false, -0.05, this);
      })
      .addButton(8, 2, 0, "OPTIONS_MUSIC_VOL", cwt.UIField.STYLE_S, 8)
      .addButton(4, 2, 0, "OPTIONS_MUSIC_VOL_UP", cwt.UIField.STYLE_ES, function () {
        updateSound(false, +0.05, this);
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
cwt.Gameflow.addMenuState({

  id: "REMAP_KEY_MAPPING",
  last: "OPTIONS",

  enter: function () {
    var map = cwt.Input.types.keyboard.MAPPING;

    this.mappingKeys[0].text = cwt.Input.codeToChar(map.RIGHT);
    this.mappingKeys[1].text = cwt.Input.codeToChar(map.LEFT);
    this.mappingKeys[2].text = cwt.Input.codeToChar(map.DOWN);
    this.mappingKeys[3].text = cwt.Input.codeToChar(map.UP);
    this.mappingKeys[4].text = cwt.Input.codeToChar(map.ACTION);
    this.mappingKeys[5].text = cwt.Input.codeToChar(map.CANCEL);
  },

  genericInput: function (keyCode) {

    var code = null;
    switch (this.index) {
      case 0:
        code = "RIGHT";
        break;
      case 1:
        code = "LEFT";
        break;
      case 2:
        code = "DOWN";
        break;
      case 3:
        code = "UP";
        break;
      case 4:
        code = "ACTION";
        break;
      case 5:
        code = "CANCEL";
        break;
    }

    cwt.assert(code);

    // set string conversion of code into the field
    this.mappingKeys[this.index].text = (this.mode === 0) ? cwt.Input.codeToChar(keyCode) : keyCode;
    ((this.mode === 0) ? cwt.Input.types.keyboard.MAPPING : cwt.Input.types.gamePad.MAPPING)[code] = keyCode;

    // invoke re-rendering
    this.rendered = false;

    // increase index
    this.index++;
    if (this.index >= this.mappingKeys.length) {

      // release generic input request
      cwt.Input.genericInput = false;
    }
  },

  init: function (layout) {
    this.mode = 0;

    var h = parseInt((cwt.SCREEN_HEIGHT - 16) / 2, 10);
    var w = parseInt((cwt.SCREEN_WIDTH - 12) / 2, 10);

    layout

      .addRowGap(h)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(4, 2, 0, "OPTIONS_KEYMAP_RIGHT", cwt.UIField.STYLE_NW, 8)
      .addButton(8, 2, 0, "VALUE_R", cwt.UIField.STYLE_NE, 8)
      .breakLine()

      .addColGap(w)
      .addButton(4, 2, 0, "OPTIONS_KEYMAP_LEFT", cwt.UIField.STYLE_W, 8)
      .addButton(8, 2, 0, "VALUE_L", cwt.UIField.STYLE_E, 8)
      .breakLine()

      .addColGap(w)
      .addButton(4, 2, 0, "OPTIONS_KEYMAP_DOWN", cwt.UIField.STYLE_W, 8)
      .addButton(8, 2, 0, "VALUE_D", cwt.UIField.STYLE_E, 8)
      .breakLine()

      .addColGap(w)
      .addButton(4, 2, 0, "OPTIONS_KEYMAP_UP", cwt.UIField.STYLE_W, 8)
      .addButton(8, 2, 0, "VALUE_U", cwt.UIField.STYLE_E, 8)
      .breakLine()

      .addColGap(w)
      .addButton(4, 2, 0, "OPTIONS_KEYMAP_ACTION", cwt.UIField.STYLE_W, 8)
      .addButton(8, 2, 0, "VALUE_A", cwt.UIField.STYLE_E, 8)
      .breakLine()

      .addColGap(w)
      .addButton(4, 2, 0, "OPTIONS_KEYMAP_CANCEL", cwt.UIField.STYLE_SW, 8)
      .addButton(8, 2, 0, "VALUE_C", cwt.UIField.STYLE_ES, 8)
      .breakLine()

      // -------------------------------------------------------

      .addRowGap(2)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(5, 2, 0, "OPTIONS_KEYMAP_GOBACK", cwt.UIField.STYLE_NORMAL, 8, function () {
        cwt.Input.saveKeyMapping();
        cwt.Gameflow.changeState("OPTIONS");
      })
      .addColGap(2)
      .addButton(5, 2, 0, "OPTIONS_KEYMAP_SET", cwt.UIField.STYLE_NORMAL, 8, function () {

        // setup generic input request
        cwt.Input.genericInput = true;
        this.index = (this.mode === 0) ? 0 : 4;
      });

    this.mappingKeys = [
      layout.getButtonByKey("VALUE_R"),
      layout.getButtonByKey("VALUE_L"),
      layout.getButtonByKey("VALUE_D"),
      layout.getButtonByKey("VALUE_U"),
      layout.getButtonByKey("VALUE_A"),
      layout.getButtonByKey("VALUE_C")
    ];
  }
});

cwt.Gameflow.addState({
  id: "INGAME_ENTER",

  enter: function () {
    this.globalData.inGameRound = true;

    if (cwt.DEBUG) {
      console.log("entering game round");
    }

    cwt.Cursor.hideNativeCursor();

    // 1. load map
    cwt.GameData.loadGame(cwt.GameSelectionDTO.map, false, function () {
      cwt.GameSelectionDTO.map = null;

      // 2. change game data by the given configuration
      cwt.GameSelectionDTO.postProcess();
      cwt.Turn.startsTurn_(cwt.Player.getInstance(0));
      cwt.Fog.fullRecalculation();

      // 3. update screen
      cwt.Screen.layerUI.clear();
      cwt.TileVariants.updateTileSprites();

      // 4. render screen
      cwt.MapRenderer.renderScreen();
      cwt.MapRenderer.renderCursor();

      // 5. start game :P
      cwt.Gameflow.changeState("INGAME_IDLE");
    });
    /*
     controller.commandStack_resetData();

     // start first turn
     if (model.round_turnOwner === -1) {
     model.events.gameround_start();
     controller.commandStack_localInvokement("nextTurn_invoked");
     if (controller.network_isHost()) model.events.weather_calculateNext();
     }
     */
  }
});
cwt.Gameflow.addState({
  id: "INGAME_FLUSH_ACTION",

  init: function () {
    var gameData = this.globalData;

    /**
     *
     * @memberOf cwt.Gameflow.globalData
     * @type {boolean}
     */
    gameData.multiStepActive = false;

    /**
     * Builds several commands from collected action data.
     *
     * @memberOf cwt.Gameflow.globalData
     */
    gameData.buildFromData = function () {
      var targetDto = gameData.target;
      var sourceDto = gameData.source;
      var actionDto = gameData.action;
      var moveDto = gameData.movePath;
      var actionObject = actionDto.object;
      var dataBlock = cwt.ActionStack.acquireCommand();

      var trapped = false;
      if (!moveDto.isEmpty()) {
        trapped = cwt.Move.trapCheck(moveDto, sourceDto);
        gameData.buildMoveCommand(sourceDto, moveDto);
      }

      // convert action to trapped wait when move path is trapped
      if (trapped) {
        actionObject = cwt.Action.getActionObject("wait");
        dataBlock.p2 = 1; // mark trapped
      }

      dataBlock.id = cwt.Action.getInstanceId(actionObject);
      actionObject.toDataBlock(gameData, dataBlock);

      cwt.ActionStack.pushCommand(false, dataBlock);

      // all unit actions invokes automatically waiting
      if (!trapped && actionObject.unitAction && !actionObject.noAutoWait) {
        dataBlock = cwt.ActionStack.acquireCommand();
        cwt.Action.getActionObject("wait").toDataBlock(gameData, dataBlock);
        cwt.ActionStack.pushCommand(false, dataBlock);
      }

      return trapped;
    }
  },

  enter: function () {
    var gameData = this.globalData;
    var trapped = gameData.buildFromData();
    var next = null;

    if (!trapped && gameData.action.object.multiStepAction) {
      gameData.multiStepActive = true;

      /*
       if( !controller.stateMachine.data.breakMultiStep ){
       controller.stateMachine.event("nextStep");
       } else {
       controller.stateMachine.event("nextStepBreak");
       }
       */

      next = "INGAME_MULTISTEP_IDLE";
    } else {
      next = "INGAME_IDLE";
    }

    cwt.Gameflow.changeState(next);
  }
});
cwt.Gameflow.addInGameState({
  id: "INGAME_IDLE",

  init: function (gameData) {

    /**
     * Position object with rich information about the selected position by an action and some relations.
     *
     * @memberOf cwt.Gameflow.globalData
     */
    gameData.source = new cwt.Position();

    /**
     * Position object with rich information about the selected position by an action and some relations.
     *
     * @memberOf cwt.Gameflow.globalData
     */
    gameData.target = new cwt.Position();

    /**
     * Position object with rich information about the selected position by an action and some relations.
     *
     * @memberOf cwt.Gameflow.globalData
     */
    gameData.targetselection = new cwt.Position();

    gameData.focusActive = false;

    /**
     *
     * @memberOf cwt.Gameflow.globalData
     * @implements cwt.InterfaceSelection
     */
    gameData.selection = {

      /** @private */
      len_: cwt.MAX_MOVE_LENGTH * 4,

      /** @private */
      data_: null,

      /** @private */
      centerX_: 0,

      /** @private */
      centerY_: 0,

      /** @override */
      getData: function () {
        return this.data_;
      },

      /** @override */
      getCenterX: function () {
        return this.centerX_;
      },

      /** @override */
      getCenterY: function () {
        return this.centerY_;
      },

      /** @override */
      setCenter: function (x, y, defValue) {

        // lazy initialization
        if (!this.data_) {
          this.data_ = [];
          for (var i = 0; i < this.len_; i++) {
            this.data_[i] = [];
          }
        }

        this.centerX = Math.max(0, x - (this.len_ - 1));
        this.centerY = Math.max(0, y - (this.len_ - 1));

        // clean data
        for (var rx = 0; rx < this.len_; rx++) {
          for (var ry = 0; ry < this.len_; ry++) {
            this.data_[rx][ry] = defValue;
          }
        }
      },

      /** @override */
      getValue: function (x, y) {
        x = x - this.centerX_;
        y = y - this.centerY_;

        if (x < 0 || y < 0 || x >= this.len_ || y >= this.len_) {
          return cwt.INACTIVE;
        } else {
          return this.data_[x][y];
        }
      },

      /** @override */
      setValue: function (x, y, value) {
        x = x - this.centerX_;
        y = y - this.centerY_;

        if (x < 0 || y < 0 || x >= this.len_ || y >= this.len_) {
          throw Error("Out of Bounds");
        } else {
          this.data_[x][y] = value;
        }
      },

      /**
       *
       * @param {number} x
       * @param {number} y
       * @return {boolean}
       */
      hasActiveNeighbour: function (x, y) {
        x = x - this.centerX_;
        y = y - this.centerY_;

        if (x < 0 || y < 0 || x >= this.len_ || y >= this.len_) {
          throw Error("Out of Bounds");
        }

        if ((x > 0 && this.data_[x - 1][y] > 0) ||
          (y > 0 && this.data_[x][y - 1] > 0) ||
          (x < this.len_ - 1 && this.data_[x + 1][y] > 0) ||
          (y < this.len_ - 1 && this.data_[x][y + 1] > 0)) {

          return true;
        } else {
          return false;
        }
      },

      /**
       *
       * @param {number} x
       * @param {number} y
       * @param {number} minValue
       * @param {boolean} walkLeft
       * @param {Function} cb
       * @param {*?} arg
       */
      nextValidPosition: function (x, y, minValue, walkLeft, cb, arg) {
        x = x - this.centerX_;
        y = y - this.centerY_;

        if (x < 0 || y < 0 || x >= this.len_ || y >= this.len_) {
          if (walkLeft) {
            // start bottom right
            x = this.len_ - 1;
            y = this.len_ - 1;

          } else {
            // start top left
            x = 0;
            y = 0;

          }
        }

        // walk to the next position
        var mod = (walkLeft) ? -1 : +1;
        y += mod;
        for (; (walkLeft) ? x >= 0 : x < this.len_; x += mod) {
          for (; (walkLeft) ? y >= 0 : y < this.len_; y += mod) {
            if (this.data_[x][y] >= minValue) {
              // valid position
              cb(x, y, arg);
              return;

            }
          }

          y = (walkLeft) ? this.len_ - 1 : 0;
        }
      },

      /**
       *
       * @param {Function} cb
       * @param {*} arg
       * @param {number} minValue
       * @return {boolean}
       */
      nextRandomPosition: function (cb, arg, minValue) {
        if (minValue === void 0) {
          minValue = 0;
        }

        var n = parseInt(Math.random() * this.len_, 10);
        for (var x = 0; x < this.len_; x++) {
          for (var y = 0; y < this.len_; y++) {
            if (this.data_[x][y] >= minValue) {
              n--;

              if (n < 0) {
                cb(x, y, arg);
                return true;
              }
            }
          }
        }

        return false;
      }
    };
  },

  enter: function (gameData) {
    gameData.source.clean();
    gameData.target.clean();
    gameData.targetselection.clean();
  },

  ACTION: function (gameData) {
    var x = cwt.Cursor.x;
    var y = cwt.Cursor.y;

    gameData.source.set(x, y);
    gameData.target.set(x, y);

    cwt.Gameflow.changeState("INGAME_MOVEPATH");
  }
});
cwt.Gameflow.addState({
  id: "INGAME_LEAVE",

  enter: function () {
    this.globalData.inGameRound = false;
    cwt.Cursor.showNativeCursor();
  }
});
cwt.Gameflow.addInGameState({
  id: "INGAME_MENU",

  // create game round data in global data scope
  init: function () {
    var gameData = this.globalData;

    /**
     * Selected game action.
     *
     * @memberOf cwt.Gameflow.globalData
     */
    gameData.action = {

      /**
       * Selected sub action object.
       */
      selectedEntry: null,

      /**
       * Selected sub action object.
       */
      selectedSubEntry: null,

      /**
       * Action object that represents the selected action.
       */
      object: null
    };

    /**
     * Game menu.
     *
     * @memberOf cwt.Gameflow.globalData
     * @implements {cwt.InterfaceMenu.<String>}
     */
    gameData.menu = {

      getSelectedIndex: function () {
        return this.selectedIndex;
      },

      /**
       * @type {cwt.CircularBuffer.<String>}
       */
      entries_: new cwt.CircularBuffer(),

      /**
       * @type {cwt.CircularBuffer.<boolean>}
       */
      enabled_: new cwt.CircularBuffer(),

      selectedIndex: 0,

      getContent: function (index) {
        if (arguments.length === 0) {
          index = this.selectedIndex;
        }
        return this.entries_.get(index);
      },

      getSize: function () {
        return this.enabled_.size;
      },

      /**
       *
       * @return {boolean}
       */
      isEnabled: function () {
        return this.enabled_.get(this.selectedIndex) === true;
      },

      clean: function () {
        this.enabled_.clear();
        this.entries_.clear();
        this.selectedIndex = 0;
      },

      addEntry: function (content, enabled) {
        this.entries_.push(content);
        this.enabled_.push(enabled);
      },

      commandKeys_: null,

      checkRelation_: function (action, relationList, sMode, stMode) {
        var checkMode;

        switch (relationList[1]) {
          case "T" :
            checkMode = sMode;
            break;

          case "ST" :
            checkMode = stMode;
            break;

          default :
            checkMode = null;
        }

        for (var si = 2, se = action.relationToProp.length; si < se; si++) {
          if (action.relationToProp[si] === checkMode) {
            return true;
          }
        }

        return false;
      },

      /**
       * Generates the action menu based on the given position data.
       */
      generate: function () {
        if (!this.commandKeys) {
          this.commandKeys = cwt.Action.getRegisteredNames();
        }

        var st_mode;
        var sst_mode;
        var pr_st_mode;
        var pr_sst_mode;
        var sPos = gameData.source;
        var tPos = gameData.target;
        var tsPos = gameData.targetselection;
        var ChkU = cwt.Relationship.CHECK_UNIT;
        var ChkP = cwt.Relationship.CHECK_PROPERTY;
        var sProp = sPos.property;
        var sUnit = sPos.unit;
        var unitActable = (!(!sUnit || sUnit.owner !== cwt.Gameround.turnOwner || !sUnit.canAct));
        var propertyActable = (!(sUnit || !sProp || sProp.owner !== cwt.Gameround.turnOwner || sProp.type.blocker));
        var mapActable = (!unitActable && !propertyActable);

        // check_ all game action objects and fill menu
        for (var i = 0, e = this.commandKeys.length; i < e; i++) {
          var action = cwt.Action.getActionObject(this.commandKeys[i]);

          switch (action.type) {

            case cwt.Action.CLIENT_ACTION:
              // TODO: ai check
              if (!mapActable || cwt.Player.activeClientPlayer !== cwt.Gameround.turnOwner) {
                continue;
              }
              break;

            case cwt.Action.PROPERTY_ACTION:
              if (!propertyActable) {
                continue;
              }
              break;

            case cwt.Action.MAP_ACTION:
              if (!mapActable) {
                continue;
              }
              break;

            case cwt.Action.UNIT_ACTION:
              if (!unitActable) {
                continue;
              }

              // extract relationships
              if (st_mode === void 0) {
                st_mode = cwt.Relationship.getRelationShipTo(sPos, tPos, ChkU, ChkU);
                sst_mode = cwt.Relationship.getRelationShipTo(sPos, tsPos, ChkU, ChkU);
                pr_st_mode = cwt.Relationship.getRelationShipTo(sPos, tPos, ChkU, ChkP);
                pr_sst_mode = cwt.Relationship.getRelationShipTo(sPos, tsPos, ChkU, ChkP);
              }

              // relation to unit
              if (action.relation) {
                if (!this.checkRelation_(action, action.relation, st_mode, sst_mode)) {
                  continue;
                }
              }

              // relation to property
              if (action.relationToProp) {
                if (!this.checkRelation_(action, action.relationToProp, pr_st_mode, pr_sst_mode)) {
                  continue;
                }
              }
              break;

            case cwt.Action.ENGINE_ACTION:
              continue;
          }

          // if condition matches then add the entry to the menu list
          if (action.condition && action.condition(gameData) !== false) {
            gameData.menu.addEntry(this.commandKeys[i], true)
          }
        }
      }
    };
  },

  enter: function (gameData) {
    cwt.Cursor.showNativeCursor();

    gameData.menu.clean();
    gameData.menu.generate();

    // go back when no entries exists
    if (!gameData.menu.getSize()) {
      cwt.Gameflow.changeState("INGAME_IDLE");
    } else {
      cwt.Screen.layerUI.clear(0);
      cwt.MapRenderer.prepareMenu(gameData.menu);
      cwt.Screen.layerUI.renderLayer(0);
    }
  },

  exit: function () {
    cwt.Cursor.hideNativeCursor();
    cwt.Screen.layerUI.clear(0);
    cwt.Screen.layerUI.clear();
  },

  inputMove: function (gameData, x, y) {
    cwt.MapRenderer.layoutGenericMenu_.updateIndex(x, y);
    gameData.menu.selectedIndex = cwt.MapRenderer.layoutGenericMenu_.selected;
    cwt.MapRenderer.renderMenu(gameData.menu);
    cwt.Screen.layerUI.renderLayer(0);
  },

  UP: function (gameData) {
    if (cwt.MapRenderer.layoutGenericMenu_.handleInput(cwt.Input.TYPE_UP)) {
      gameData.menu.selectedIndex = cwt.MapRenderer.layoutGenericMenu_.selected;
      cwt.MapRenderer.renderMenu(gameData.menu);
      cwt.Screen.layerUI.renderLayer(0);
    }
  },

  DOWN: function (gameData) {
    if (cwt.MapRenderer.layoutGenericMenu_.handleInput(cwt.Input.TYPE_DOWN)) {
      gameData.menu.selectedIndex = cwt.MapRenderer.layoutGenericMenu_.selected;
      cwt.MapRenderer.renderMenu(gameData.menu);
      cwt.Screen.layerUI.renderLayer(0);
    }
  },

  ACTION: function (gameData) {
    var actName = gameData.menu.getContent();
    var actObj = cwt.Action.getActionObject(actName);

    // select action in data
    gameData.action.selectedEntry = actName;
    gameData.action.object = actObj;

    // calculate next state from the given action object
    var next = null;
    if (actObj.prepareMenu !== null) {
      next = "INGAME_SUBMENU";
    } else if (actObj.isTargetValid !== null) {
      next = "INGAME_SELECT_TILE";
    } else if (actObj.prepareTargets !== null && actObj.targetSelectionType === "A") {
      next = "INGAME_SELECT_TILE_TYPE_A";
    } else {
      next = "INGAME_FLUSH_ACTION";
    }

    if (cwt.DEBUG) cwt.assert(next);
    cwt.Gameflow.changeState(next);
  },

  CANCEL: function (gameData) {
    var unit = gameData.source.unit;
    var next = null;

    if (unit && unit.owner.activeClientPlayer) {
      // unit was selected and it is controlled by the active player, so it means that this unit
      // is the acting unit -> go back to INGAME_MOVEPATH state without erasing the existing move data

      gameData.preventMovePathGeneration = true;
      next = "INGAME_MOVEPATH";

    } else {
      next = "INGAME_IDLE";
    }

    if (cwt.DEBUG) cwt.assert(next);
    cwt.Gameflow.changeState(next);
  }
});
cwt.Gameflow.addInGameState({
  id: "INGAME_MOVEPATH",

  init: function () {
    var gameData = this.globalData;

    /**
     *
     * @type {cwt.CircularBuffer}
     * @memberOf cwt.Gameflow.globalData
     */
    gameData.movePath = new cwt.CircularBuffer(cwt.MAX_MOVE_LENGTH);

    /**
     *
     * @type {boolean}
     */
    gameData.preventMovePathGeneration = false;

    gameData.buildLoadMoveCommand = function (source, moveDto) {

    };

    gameData.buildUnloadMoveCommand = function (source, moveDto) {

    };

    // TODO: load/unload
    gameData.buildMoveCommand = function (source, moveDto) {
      gameData.buildMoveCommand_(source, moveDto, 0, 0);
    };

    /**
     *
     * @param source
     * @param moveDto
     * @param noFuel
     * @param posSet
     * @private
     */
    gameData.buildMoveCommand_ = function (source, moveDto, noFuel, posSet) {
      var dataBlock;

      dataBlock = cwt.ActionStack.acquireCommand();
      dataBlock.id = cwt.Action.getInstanceId(cwt.Action.getInstance("clearMove"));
      cwt.ActionStack.pushCommand(false, dataBlock);

      // push codes
      for (var i = 0, e = moveDto.size; i < e; i += 5) {
        dataBlock = cwt.ActionStack.acquireCommand();
        dataBlock.id = cwt.Action.getInstanceId(cwt.Action.getInstance("pushToMove"));

        if (moveDto.get(i) !== cwt.INACTIVE) dataBlock.p1 = moveDto.get(i);
        if (moveDto.get(i + 1) !== cwt.INACTIVE) dataBlock.p2 = moveDto.get(i + 1);
        if (moveDto.get(i + 2) !== cwt.INACTIVE) dataBlock.p3 = moveDto.get(i + 2);
        if (moveDto.get(i + 3) !== cwt.INACTIVE) dataBlock.p4 = moveDto.get(i + 3);
        if (moveDto.get(i + 4) !== cwt.INACTIVE) dataBlock.p5 = moveDto.get(i + 4);

        cwt.ActionStack.pushCommand(false, dataBlock);
      }

      dataBlock = cwt.ActionStack.acquireCommand();
      dataBlock.id = cwt.Action.getInstanceId(cwt.Action.getInstance("flushMove"));
      dataBlock.p1 = cwt.Unit.getInstanceId(source.unit);
      dataBlock.p2 = source.x;
      dataBlock.p3 = source.y;
      dataBlock.p4 = noFuel;
      dataBlock.p5 = posSet;
      cwt.ActionStack.pushCommand(false, dataBlock);
    };
  },

  enter: function (gameData) {

    // when we do back steps in the game flow then we don't want to recreate an already created move way
    if (gameData.preventMovePathGeneration) {
      gameData.preventMovePathGeneration = false;
      return;
    }

    var breakMove = false;

    if (cwt.Gameround.isTurnOwnerObject(gameData.source.unit) && gameData.source.unit.canAct) {

      // prepare move map and clean way
      gameData.movePath.clear();

      cwt.Move.fillMoveMap(
        gameData.source,
        gameData.selection,
        gameData.source.x,
        gameData.source.y,
        gameData.source.unit
      );

      // go directly into action menu when the unit cannot move
      if (!gameData.selection.hasActiveNeighbour(gameData.source.x, gameData.source.y)) {
        breakMove = true;
      }
    } else {
      breakMove = true;
    }

    if (breakMove) {
      gameData.focusActive = false;
      cwt.Gameflow.changeState("INGAME_MENU");
    } else {
      gameData.focusActive = true;
      cwt.MapRenderer.renderFocusOnScreen(gameData.selection);
    }
  },

  exit: function (gameData) {
    gameData.focusActive = false;
    cwt.Screen.layerFocus.clearAll();
  },

  ACTION: function (gameData) {
    var x = cwt.Cursor.x;
    var y = cwt.Cursor.y;

    // selected tile is not in the selection -> ignore action
    if (gameData.selection.getValue(x, y) < 0) {
      return;
    }

    var ox = gameData.target.x;
    var oy = gameData.target.y;
    var dis = cwt.Map.getDistance(ox, oy, x, y);

    gameData.target.set(x, y);

    if (dis === 1) {

      // Try to add the cursor move as code to the move path
      cwt.Move.addCodeToMovePath(
        cwt.Move.codeFromAtoB(ox, oy, x, y),
        gameData.movePath,
        gameData.selection,
        x,
        y
      );

    } else {

      // Generate a complete new path because between the old tile and the new tile is at least another one tile
      cwt.Move.generateMovePath(
        gameData.source.x,
        gameData.source.y,
        x,
        y,
        gameData.selection,
        gameData.movePath
      );
    }

    if (dis === 0 || cwt.Options.fastClickMode) {
      cwt.Gameflow.changeState(next);
    }
  },

  CANCEL: function () {
    cwt.Gameflow.changeState("INGAME_IDLE");
  }
});
cwt.Gameflow.addState({
  id: "INGAME_MULTISTEP_IDLE",

  init: function () {
    var gameData = this.globalData;

    gameData.inMultiStep = false;

    gameData.nextStep = function () {
      gameData.movePath.clean();
      gameData.menu.clean();
      gameData.action.object.prepareMenu(this.data);

      if (!gameData.menu.getSize()) {
        cwt.Gameflow.changeState("INGAME_IDLE");
      }

      gameData.menu.addEntry("done", true);
      gameData.inMultiStep = true;

      cwt.Gameflow.changeState("INGAME_SUBMENU");
    };

    gameData.nextStepBreak = function () {
      cwt.Gameflow.changeState("INGAME_IDLE");
    };
  },

  enter: function () {
    this.globalData.inMultiStep = false;
  }
});
cwt.Gameflow.addInGameState({
  id: "INGAME_SELECT_TILE",

  enter: function (gameData) {
    gameData.targetselection.clean();

    /*
     var prepareSelection = this.data.action.object.prepareSelection;
     if (prepareSelection) prepareSelection(this.data);
     else this.data.selectionRange = 1;
     */
  },

  ACTION: function (gameData) {
    if (gameData.action.object.isTargetValid(gameData, cwt.Cursor.x, cwt.Cursor.y)) {
      gameData.targetselection.set(cwt.Cursor.x, cwt.Cursor.y);
      cwt.Gameflow.changeState("INGAME_FLUSH_ACTIONS");
    }
  },

  CANCEL: function (gameData) {
    cwt.Gameflow.changeState("INGAME_MENU");
  }
});
cwt.Gameflow.addInGameState({
  id: "INGAME_SHOW_ATTACK_RANGE",

  enter: function () {
    // TODO: prepare range
    // TODO: render range to layer
  },

  exit: function () {
    cwt.Screen.layerEffects.clear();
  },

  CANCEL: function () {
    cwt.Gameflow.changeState("INGAME_IDLE");
  }
});
cwt.Gameflow.addInGameState({
  id: "INGAME_SUBMENU",

  enter: function (gameData) {
    gameData.menu.clean();
    gameData.menu.generate();

    // go back when no entries exists
    if (!gameData.menu.getSize()) {
      throw Error("sub menu cannot be empty");
    }
  },

  ACTION: function (gameData) {
    if (gameData.menu.isEnabled()) {
      return;
    }

    var actName = gameData.menu.getContent();

    if (actName === "done") {
      cwt.Gameflow.changeState("INGAME_IDLE");
      return;
    }

    gameData.action.selectedSubEntry = actName;
    var actObj = cwt.Action.getActionObject(actName);

    var next = null;
    if (actObj.prepareTargets && actObj.targetSelectionType === "B") {
      // return this.data.selection.prepare();
    } else {
      next = "INGAME_FLUSH_ACTIONS";
    }

    if (cwt.DEBUG) cwt.assert(next);
    cwt.Gameflow.changeState(next);
  },

  CANCEL: function () {
    cwt.Gameflow.changeState("INGAME_MENU");
  }
});
cwt.Gameflow.addInGameState({
  id: "INGAME_SELECT_TILE_TYPE_A",

  enter: function (gameData) {
    gameData.targetselection.clean();
  },

  ACTION: function (gameData) {
    if (gameData.selection.getValue(cwt.Cursor.x, cwt.Cursor.y) >= 0) {
      gameData.targetselection.set(cwt.Cursor.x, cwt.Cursor.y);
      cwt.Gameflow.changeState("INGAME_FLUSH_ACTIONS");
    }
  },

  CANCEL: function (gameData) {
    cwt.Gameflow.changeState("INGAME_MENU");
  }
});
cwt.Gameflow.addInGameState({
  id: "INGAME_SELECT_TILE_TYPE_B",

  enter: function (gameData) {
    gameData.targetselection.clean();
  },

  ACTION: function (gameData) {
    if (gameData.selection.getValue(cwt.Cursor.x, cwt.Cursor.y) >= 0) {
      gameData.targetselection.set(cwt.Cursor.x, cwt.Cursor.y);
      cwt.Gameflow.changeState("INGAME_FLUSH_ACTIONS");
    }
  },

  CANCEL: function (gameData) {
    cwt.Gameflow.changeState("INGAME_MENU");
  }
});

cwt.Gameflow.addState({
  id: "ANIMATION_BALLISTIC",

  init: function () {

  },

  enter: function () {

  },

  update: function (delta, lastInput) {

  },

  render: function (delta) {

  }
});
cwt.Gameflow.addState({
  id: "ANIMATION_CAPTURE_PROPERTY",

  init: function () {

  },

  enter: function () {

  },

  update: function (delta, lastInput) {

  },

  render: function (delta) {

  }
});
cwt.Gameflow.addState({
  id: "ANIMATION_CHANGE_WEATHER",

  init: function () {

  },

  enter: function () {

  },

  update: function (delta, lastInput) {

  },

  render: function (delta) {

  }
});
cwt.Gameflow.addState({
  id: "ANIMATION_DESTROY_UNIT",

  init: function () {

  },

  enter: function () {

  },

  update: function (delta, lastInput) {

  },

  render: function (delta) {

  }
});
cwt.Gameflow.addState({
  id: "ANIMATION_MOVE",

  init: function () {

  },

  enter: function () {

  },

  update: function (delta, lastInput) {

  },

  render: function (delta) {

  }
});
cwt.Gameflow.addState({
  id: "ANIMATION_NEXT_TURN",

  init: function () {
    this.state = -1;
  },

  enter: function () {
    this.state = 99;
  },

  update: function (delta, lastInput) {
    switch (this.state) {

      // render bottom line
      case 0:
        break;

      // render text
      case 1:
        break;

      // load and play co music
      case 2:
        var co = cwt.Gameround.turnOwner.coA;
        if (co) {
          cwt.Audio.playMusic(co.music);
          this.state++;
        }
        break;

      case 3:
        if (!cwt.Audio.currentMusic_.inLoadProcess) {
          this.state++;
        }
        break;

      // hide both
      case 4:
        break;

      // go into idle
      case 5:
        break;

      case 99:
        cwt.Gameflow.changeState("INGAME_IDLE");
        break;
    }
  },

  render: function (delta) {
    switch (this.state) {

      // render bottom line
      case 0:
        break;

      // render text
      case 1:
        break;

      // hide both
      case 4:
        break;
    }
  }
});
cwt.Gameflow.addState({
  id: "ANIMATION_TRAPPED",

  init: function () {

  },

  enter: function () {

  },

  update: function (delta, lastInput) {

  },

  render: function (delta) {

  }
});

/*
 util.scoped(function(){

 var expl_img;
 var rocket_img;
 var rocket_img_inv;

 function renderSmoke( x,y, step, distance ){
 step -= (distance-1);
 if( step < 0 || step > 9 ) return;

 var tileSize = TILE_LENGTH;
 var scx = 48*step;
 var scy = 0;
 var scw = 48;
 var sch = 48;
 var tcx = (x)*tileSize;
 var tcy = (y)*tileSize;
 var tcw = tileSize;
 var tch = tileSize;

 view.canvasCtx.drawImage(
 expl_img,
 scx,scy,
 scw,sch,
 tcx,tcy,
 tcw,tch
 );

 view.redraw_markPos(x,y);
 }

 function checkStatus( x,y ){
 if( model.map_isValidPosition(x,y) ){
 var unit = model.unit_posData[x][y];
 if( unit !== null ){
 controller.updateUnitStatus( model.unit_extractId(unit) );
 }
 }
 }

 view.registerAnimationHook({
 key: "rocketFly",

 prepare: function( x,y, tx,ty,siloId ){
 if( !rocket_img ) rocket_img = view.getInfoImageForType("FLYING_ROCKET");
 if( !rocket_img_inv ) rocket_img_inv = view.getInfoImageForType("FLYING_ROCKET_INV");

 this.siloX   = controller.getCanvasPosX(x);
 this.siloY   = controller.getCanvasPosY(y);
 this.targetX = controller.getCanvasPosX(tx);
 this.targetY = controller.getCanvasPosY(ty);
 this.curX    = this.siloX;
 this.curY    = this.siloY;
 this.phase = 0;
 },

 render: function(){
 var tileSize = TILE_LENGTH;
 var scx = 0;
 var scy = 0;
 var scw = 24;
 var sch = 24;
 var tcx = this.curX;
 var tcy = this.curY;
 var tcw = tileSize +8;
 var tch = tileSize +8;

 if( tcy < 0 ){
 scw += tcy;
 scy -= tcy;
 tcy = 0;
 }

 view.canvasCtx.drawImage(
 (this.phase===0)? rocket_img : rocket_img_inv,
 scx,scy,
 scw,sch,
 tcx,tcy,
 tcw,tch
 );

 view.redraw_markPosWithNeighboursRing(
 parseInt(this.curX/TILE_LENGTH, 10),
 parseInt(this.curY/TILE_LENGTH, 10)
 );
 },

 update: function( delta ){
 var shift = ( delta/1000 ) * ( TILE_LENGTH*14);

 if( this.phase === 0 ){

 // rocket flies up
 this.curY -= shift;

 if( this.curY <= 0 ){
 // controller.setScreenPosition( this.targetX, this.targetY, true );

 this.curX = this.targetX;
 this.curY = 0;
 this.phase = 1;
 }
 }
 else {

 // rocket flies down
 this.curY += shift;

 if( this.curY >= this.targetY ){
 this.phase = 2;
 }
 }
 },

 isDone: function(){
 return (this.phase === 2);
 }
 });

 view.registerAnimationHook({

 key: "explode_invoked",

 prepare: function( tx,ty, range, damage, owner ){
 if( !expl_img ) expl_img = view.getInfoImageForType("EXPLOSION_GROUND");
 controller.audio_playSound("ROCKET_IMPACT");

 this.x = tx;
 this.y = ty;
 this.range = range;
 this.maxStep = 10+range+1;
 this.step = 0;
 this.time = 0;
 },

 render: function(){
 model.map_doInRange( this.x, this.y, this.range, renderSmoke, this.step );
 },

 update: function( delta ){
 this.time += delta;
 if( this.time > 75 ){
 this.step++;
 this.time = 0;
 }
 },

 isDone: function(){
 var done = this.step === this.maxStep;

 // RENDER HP LOST
 if( done ) model.map_doInRange( this.x, this.y, this.range, checkStatus );

 return done;
 }

 });

 view.registerAnimationHook({

 key: "bombs_fireCannon",

 prepare: function( ox,oy,x,y,tp ){
 var type = model.data_tileSheets[tp];

 var fireAnim = type.assets.fireAnimation;
 cwt.assert( fireAnim.length === 5 );

 this.pic     = view.getInfoImageForType(fireAnim[0]);
 this.sizeX   = fireAnim[1];
 this.sizeY   = fireAnim[2];
 this.offsetX = fireAnim[3];
 this.offsetY = fireAnim[4];

 this.curX    = ox;
 this.curY    = oy;

 this.step    = 0;
 this.time    = 0;

 controller.audio_playSound( type.assets.fireSound);
 },

 render: function(){
 var tileSize = TILE_LENGTH;
 var scx = this.sizeX*this.step;
 var scy = 0;
 var scw = this.sizeX;
 var sch = this.sizeY;
 var tcx = (this.curX)*tileSize + this.offsetX;
 var tcy = (this.curY)*tileSize + this.offsetY;
 var tcw = this.sizeX;
 var tch = this.sizeY;

 view.canvasCtx.drawImage(
 this.pic,
 scx,scy,
 scw,sch,
 tcx,tcy,
 tcw,tch
 );

 },

 update: function( delta ){
 this.time += delta;
 if( this.time > 100 ){
 this.step++;
 this.time = 0;
 }
 },

 isDone: function(){
 return this.step === 6;
 }

 });

 view.registerAnimationHook({

 key: "bombs_fireLaser",

 prepare: function( ox,oy ){
 // var type = model.data_tileSheets[tp];
 var type = model.property_posMap[ox][oy].type;

 var fireAnimA = type.assets.chargeAnimation;
 var fireAnimB = type.assets.fireAnimation;
 var fireAnimC = type.assets.streamAnimation;
 cwt.assert( fireAnimA.length === 5 );
 cwt.assert( fireAnimB.length === 5 );
 cwt.assert( fireAnimC.length === 5 );
 this.a      = {
 pic     : view.getInfoImageForType(fireAnimA[0]),
 sizeX   : fireAnimB[1],
 sizeY   : fireAnimB[2],
 offsetX : fireAnimB[3],
 offsetY : fireAnimB[4]
 };

 this.b      = {
 pic     : view.getInfoImageForType(fireAnimB[0]),
 sizeX   : fireAnimA[1],
 sizeY   : fireAnimA[2],
 offsetX : fireAnimA[3],
 offsetY : fireAnimA[4]
 };

 this.c      = {
 pic     : view.getInfoImageForType(fireAnimC[0]),
 sizeX   : fireAnimC[1],
 sizeY   : fireAnimC[2],
 offsetX : fireAnimC[3],
 offsetY : fireAnimC[4]
 };

 //W
 fireAnimA = type.assets.chargeAnimation3;
 fireAnimB = type.assets.fireAnimation3;
 fireAnimC = type.assets.streamAnimation3;
 cwt.assert( fireAnimA.length === 5 );
 cwt.assert( fireAnimB.length === 5 );
 cwt.assert( fireAnimC.length === 5 );

 this.a2      = {
 pic     : view.getInfoImageForType(fireAnimA[0]),
 sizeX   : fireAnimB[1],
 sizeY   : fireAnimB[2],
 offsetX : fireAnimB[3],
 offsetY : fireAnimB[4]
 };

 this.b2      = {
 pic     : view.getInfoImageForType(fireAnimB[0]),
 sizeX   : fireAnimA[1],
 sizeY   : fireAnimA[2],
 offsetX : fireAnimA[3],
 offsetY : fireAnimA[4]
 };

 this.c2      = {
 pic     : view.getInfoImageForType(fireAnimC[0]),
 sizeX   : fireAnimC[1],
 sizeY   : fireAnimC[2],
 offsetX : fireAnimC[3],
 offsetY : fireAnimC[4]
 };

 //S
 fireAnimA = type.assets.chargeAnimation2;
 fireAnimB = type.assets.fireAnimation2;
 fireAnimC = type.assets.streamAnimation2;
 cwt.assert( fireAnimA.length === 5 );
 cwt.assert( fireAnimB.length === 5 );
 cwt.assert( fireAnimC.length === 5 );

 this.a3      = {
 pic     : view.getInfoImageForType(fireAnimA[0]),
 sizeX   : fireAnimB[1],
 sizeY   : fireAnimB[2],
 offsetX : fireAnimB[3],
 offsetY : fireAnimB[4]
 };

 this.b3      = {
 pic     : view.getInfoImageForType(fireAnimB[0]),
 sizeX   : fireAnimA[1],
 sizeY   : fireAnimA[2],
 offsetX : fireAnimA[3],
 offsetY : fireAnimA[4]
 };

 this.c3      = {
 pic     : view.getInfoImageForType(fireAnimC[0]),
 sizeX   : fireAnimC[1],
 sizeY   : fireAnimC[2],
 offsetX : fireAnimC[3],
 offsetY : fireAnimC[4]
 };

 //N
 fireAnimA = type.assets.chargeAnimation4;
 fireAnimB = type.assets.fireAnimation4;
 fireAnimC = type.assets.streamAnimation4;
 cwt.assert( fireAnimA.length === 5 );
 cwt.assert( fireAnimB.length === 5 );
 cwt.assert( fireAnimC.length === 5 );

 this.a4      = {
 pic     : view.getInfoImageForType(fireAnimA[0]),
 sizeX   : fireAnimB[1],
 sizeY   : fireAnimB[2],
 offsetX : fireAnimB[3],
 offsetY : fireAnimB[4]
 };

 this.b4      = {
 pic     : view.getInfoImageForType(fireAnimB[0]),
 sizeX   : fireAnimA[1],
 sizeY   : fireAnimA[2],
 offsetX : fireAnimA[3],
 offsetY : fireAnimA[4]
 };

 this.c4      = {
 pic     : view.getInfoImageForType(fireAnimC[0]),
 sizeX   : fireAnimC[1],
 sizeY   : fireAnimC[2],
 offsetX : fireAnimC[3],
 offsetY : fireAnimC[4]
 };

 this.curX    = ox;
 this.curY    = oy;

 this.phase   = 0;
 this.step    = 0;
 this.time    = 0;

 controller.audio_playSound( type.assets.fireSound );
 },

 render: function(){
 var data = (this.phase === 0)? this.a : this.b;
 var data2 = (this.phase === 0)? this.a2 : this.b2;
 var data3 = (this.phase === 0)? this.a3 : this.b3;
 var data4 = (this.phase === 0)? this.a4 : this.b4;

 // E
 var tileSize = TILE_LENGTH;
 var scx = data.sizeX*this.step;
 var scy = 0;
 var scw = data.sizeX;
 var sch = data.sizeY;
 var tcx = (this.curX)*tileSize + data.offsetX;
 var tcy = (this.curY)*tileSize + data.offsetY;
 var tcw = data.sizeX;
 var tch = data.sizeY;
 view.canvasCtx.drawImage(
 data.pic,
 scx,scy,
 scw,sch,
 tcx,tcy,
 tcw,tch
 );

 //W
 tileSize = TILE_LENGTH;
 scx = data2.sizeX*this.step;
 scy = 0;
 scw = data2.sizeX;
 sch = data2.sizeY;
 tcx = (this.curX)*tileSize + data2.offsetX;
 tcy = (this.curY)*tileSize + data2.offsetY;
 tcw = data2.sizeX;
 tch = data2.sizeY;
 view.canvasCtx.drawImage(
 data2.pic,
 scx,scy,
 scw,sch,
 tcx,tcy,
 tcw,tch
 );

 //S
 tileSize = TILE_LENGTH;
 scx = data3.sizeX*this.step;
 scy = 0;
 scw = data3.sizeX;
 sch = data3.sizeY;
 tcx = (this.curX)*tileSize + data3.offsetX;
 tcy = (this.curY)*tileSize + data3.offsetY;
 tcw = data3.sizeX;
 tch = data3.sizeY;
 view.canvasCtx.drawImage(
 data3.pic,
 scx,scy,
 scw,sch,
 tcx,tcy,
 tcw,tch
 );

 //N
 tileSize = TILE_LENGTH;
 scx = data4.sizeX*this.step;
 scy = 0;
 scw = data4.sizeX;
 sch = data4.sizeY;
 tcx = (this.curX)*tileSize + data4.offsetX;
 tcy = (this.curY)*tileSize + data4.offsetY;
 tcw = data4.sizeX;
 tch = data4.sizeY;
 view.canvasCtx.drawImage(
 data4.pic,
 scx,scy,
 scw,sch,
 tcx,tcy,
 tcw,tch
 );


 // redraw
 view.redraw_markPosWithNeighboursRing(this.curX, this.curY);

 // TODO: streched over all tiles in the cross
 if( data === this.b ){
 data = this.c;
 data2 = this.c2;
 data3 = this.c3;
 data4 = this.c4;

 // E
 scx = data.sizeX*this.step;
 scy = 0;
 scw = data.sizeX;
 sch = data.sizeY;
 for( var ci = this.curX+1, ce=model.map_width; ci < ce; ci++ ){
 tcx = (ci)*tileSize + data.offsetX;
 tcy = (this.curY)*tileSize + data.offsetY;
 tcw = data.sizeX;
 tch = data.sizeY;

 view.canvasCtx.drawImage(
 data.pic,
 scx,scy,
 scw,sch,
 tcx,tcy,
 tcw,tch
 );

 view.redraw_markPos( ci, this.curY-1 );
 view.redraw_markPos( ci, this.curY );
 view.redraw_markPos( ci, this.curY+1 );
 }

 // W
 scx = data2.sizeX*this.step;
 scy = 0;
 scw = data2.sizeX;
 sch = data2.sizeY;
 for( var ci = this.curX-1, ce=0; ci >= ce; ci-- ){
 tcx = (ci)*tileSize + data2.offsetX;
 tcy = (this.curY)*tileSize + data2.offsetY;
 tcw = data2.sizeX;
 tch = data2.sizeY;

 view.canvasCtx.drawImage(
 data2.pic,
 scx,scy,
 scw,sch,
 tcx,tcy,
 tcw,tch
 );

 view.redraw_markPos( ci, this.curY-1 );
 view.redraw_markPos( ci, this.curY );
 view.redraw_markPos( ci, this.curY+1 );
 }

 // S
 scx = data3.sizeX*this.step;
 scy = 0;
 scw = data3.sizeX;
 sch = data3.sizeY;
 for( var ci = this.curY+1, ce=model.map_height; ci < ce; ci++ ){
 tcx = (this.curX)*tileSize + data3.offsetX;
 tcy = (ci)*tileSize + data3.offsetY;
 tcw = data3.sizeX;
 tch = data3.sizeY;

 view.canvasCtx.drawImage(
 data3.pic,
 scx,scy,
 scw,sch,
 tcx,tcy,
 tcw,tch
 );

 view.redraw_markPos( this.curX+1,ci );
 view.redraw_markPos( this.curX,ci );
 view.redraw_markPos( this.curX-1,ci);
 }

 // N
 scx = data4.sizeX*this.step;
 scy = 0;
 scw = data4.sizeX;
 sch = data4.sizeY;
 for( var ci = this.curY-1, ce=0; ci >= 0; ci-- ){
 tcx = (this.curX)*tileSize + data4.offsetX;
 tcy = (ci)*tileSize + data4.offsetY;
 tcw = data4.sizeX;
 tch = data4.sizeY;

 view.canvasCtx.drawImage(
 data4.pic,
 scx,scy,
 scw,sch,
 tcx,tcy,
 tcw,tch
 );

 view.redraw_markPos( this.curX+1,ci );
 view.redraw_markPos( this.curX,ci );
 view.redraw_markPos( this.curX-1,ci );
 }
 }
 },

 update: function( delta ){
 this.time += delta;
 if( this.time > 100 ){
 this.step++;
 this.time = 0;

 switch( this.phase ){

 // charge phase
 case 0:
 if( this.step === 10 ){
 this.step = 0;
 this.phase++;
 }

 // fire phase
 case 1:
 if( this.step === 12 ){
 this.step = 0;
 this.phase++;
 }
 }
 }
 },

 isDone: function(){
 return this.phase === 2;
 }

 });

 });

 */
/*
 view.registerAnimationHook({

 key: "capture_invoked",

 prepare: function( prid, cid ){
 controller.updateUnitStatus( cid );

 var property = model.property_data[ prid ];
 if( model.fog_clientData[property.x][property.y] > 0 ){

 if( property.capturePoints === 20 ){
 view.showInfoMessage(
 model.data_localized("propertyCaptured")
 );
 } else {
 view.showInfoMessage(
 model.data_localized("propertyPointsLeft")+" "+property.capturePoints
 );
 }
 }
 },

 render: function(){},
 update: function(){},

 isDone: function(){
 return !view.hasInfoMessage();
 }

 });
 */
/*
 view.registerAnimationHook({

 key: "weather_change",

 prepare: function( wth ){
 view.showInfoMessage( model.data_localized("weatherChange")+" "+model.data_localized( wth ) );
 },

 render: function(){},
 update: function(){},

 isDone: function(){
 return !view.hasInfoMessage();
 }

 });
 */
/*
 view.registerAnimationHook({

 key: "destroyUnit",

 prepare: function( id ){
 var unit = model.unit_data[ id ];

 this.step = 0;
 this.time = 0;

 this.x = -unit.x;
 this.y = -unit.y;

 controller.audio_playSound("EXPLODE");
 },

 render: function(){
 var step = this.step;

 var pic = view.getInfoImageForType("EXPLOSION_GROUND");

 var x = this.x;
 var y = this.y;

 var tileSize = TILE_LENGTH;
 var scx = 48*step;
 var scy = 0;
 var scw = 48;
 var sch = 48;
 var tcx = (x)*tileSize;
 var tcy = (y)*tileSize;
 var tcw = tileSize;
 var tch = tileSize;

 view.canvasCtx.drawImage(
 pic,
 scx,scy,
 scw,sch,
 tcx,tcy,
 tcw,tch
 );

 view.redraw_markPos(x,y);
 },

 update: function( delta ){
 this.time += delta;
 if( this.time > 75 ){
 this.step++;
 this.time = 0;
 }
 },

 isDone: function(){
 return this.step === 10;
 }

 });
 */
/*
 view.registerAnimationHook({

 key: "move_moveByCache",

 prepare: function( uid, x,y ){

 this.moveAnimationX     = x;
 this.moveAnimationY     = y;
 this.moveAnimationIndex = 0;
 this.moveAnimationPath  = model.move_pathCache;
 this.moveAnimationUid   = uid;
 this.moveAnimationClientOwned = model.fog_visibleClientPids[
 model.unit_data[ uid ].owner ];
 this.moveAnimationShift = 0;

 this.moveAnimationDustX = -1;
 this.moveAnimationDustY = -1;
 this.moveAnimationDustTime = -1;
 this.moveAnimationDustStep = -1;
 this.moveAnimationDustPic = null;

 view.preventRenderUnit = model.unit_data[ uid ];
 var mvType = model.unit_data[ uid ].type.movetype;

 if( this.DEBUG ){
 util.log(
 "drawing move from",
 "(",this.moveAnimationX,",",this.moveAnimationY,")",
 "with path",
 "(",this.moveAnimationPath,")"
 );
 }
 },

 update: function( delta ){
 var tileSize = TILE_LENGTH;

 // MOVE 4 TILES / SECOND
 this.moveAnimationShift += ( delta/1000 ) * ( tileSize*8);

 view.redraw_markPosWithNeighboursRing(
 this.moveAnimationX, this.moveAnimationY
 );

 // DUST
 if( this.moveAnimationDustStep !== -1 ){

 this.moveAnimationDustTime += delta;
 if( this.moveAnimationDustTime > 30 ){

 this.moveAnimationDustStep++;
 this.moveAnimationDustTime = 0;

 if( this.moveAnimationDustStep === 3 ){
 this.moveAnimationDustStep = -1;
 }
 }
 }

 if( this.moveAnimationShift > tileSize ){

 this.moveAnimationDustX = this.moveAnimationX;
 this.moveAnimationDustY = this.moveAnimationY;
 this.moveAnimationDustTime = 0;
 this.moveAnimationDustStep = 0;

 // UPDATE ANIMATION POS
 switch( this.moveAnimationPath[ this.moveAnimationIndex ] ){

 case model.move_MOVE_CODES.UP :
 this.moveAnimationY--;
 this.moveAnimationDustPic = view.getInfoImageForType("DUST_U");
 break;

 case model.move_MOVE_CODES.RIGHT :
 this.moveAnimationX++;
 this.moveAnimationDustPic = view.getInfoImageForType("DUST_R");
 break;

 case model.move_MOVE_CODES.DOWN :
 this.moveAnimationY++;
 this.moveAnimationDustPic = view.getInfoImageForType("DUST_D");
 break;

 case model.move_MOVE_CODES.LEFT :
 this.moveAnimationX--;
 this.moveAnimationDustPic = view.getInfoImageForType("DUST_L");
 break;
 }

 this.moveAnimationIndex++;

 this.moveAnimationShift -= tileSize;
 // this.moveAnimationShift = 0;

 if( this.moveAnimationIndex === this.moveAnimationPath.length ||
 this.moveAnimationPath[this.moveAnimationIndex] === cwt.INACTIVE ){
 this.moveAnimationX     = 0;
 this.moveAnimationY     = 0;
 this.moveAnimationIndex = 0;
 this.moveAnimationPath  = null;
 this.moveAnimationUid   = -1;
 this.moveAnimationShift = 0;
 view.preventRenderUnit = null; // RENDER UNIT NOW NORMALLY
 }
 }
 },

 render: function(){
 var uid      = this.moveAnimationUid;
 var cx       = this.moveAnimationX;
 var cy       = this.moveAnimationY;
 var shift    = this.moveAnimationShift;
 var moveCode = this.moveAnimationPath[ this.moveAnimationIndex ];
 var unit     = model.unit_data[ uid ];
 var color = view.colorArray[ unit.owner ];
 var state;
 var tp = unit.type;

 // check_ visibility
 if( !this.moveAnimationClientOwned && !model.fog_clientData[cx][cy] ){
 return;
 }

 // GET CORRECT IMAGE STATE
 switch( moveCode ){
 case model.move_MOVE_CODES.UP :    state = view.IMAGE_CODE_UP;    break;
 case model.move_MOVE_CODES.RIGHT : state = view.IMAGE_CODE_RIGHT; break;
 case model.move_MOVE_CODES.DOWN :  state = view.IMAGE_CODE_DOWN;  break;
 case model.move_MOVE_CODES.LEFT :  state = view.IMAGE_CODE_LEFT;  break;
 }

 var pic = view.getUnitImageForType( tp.ID, state, color );

 var tileSize = TILE_LENGTH;
 var BASESIZE = controller.baseSize;
 var scx = (BASESIZE*2)*view.getSpriteStep("UNIT");
 var scy = 0;
 var scw = BASESIZE*2;
 var sch = BASESIZE*2;
 var tcx = ( cx )*tileSize -tileSize/2; // TODO
 var tcy = ( cy )*tileSize -tileSize/2;
 var tcw = tileSize+tileSize;
 var tch = tileSize+tileSize;

 // ADD SHIFT
 switch( moveCode ){
 case model.move_MOVE_CODES.UP:    tcy -= shift; break;
 case model.move_MOVE_CODES.LEFT:  tcx -= shift; break;
 case model.move_MOVE_CODES.RIGHT: tcx += shift; break;
 case model.move_MOVE_CODES.DOWN:  tcy += shift; break;
 }

 // DRAW IT
 if( pic !== undefined ){
 view.canvasCtx.drawImage(
 pic,
 scx,scy,
 scw,sch,
 tcx,tcy,
 tcw,tcw
 );
 }
 else{
 tcx = ( cx )*tileSize;
 tcy = ( cy )*tileSize;
 tcw = tileSize;
 tch = tileSize;

 // ADD SHIFT
 switch( moveCode ){
 case model.move_MOVE_CODES.UP:    tcy -= shift; break;
 case model.move_MOVE_CODES.LEFT:  tcx -= shift; break;
 case model.move_MOVE_CODES.RIGHT: tcx += shift; break;
 case model.move_MOVE_CODES.DOWN:  tcy += shift; break;
 }

 view.canvasCtx.fillStyle="rgb(255,0,0)";
 view.canvasCtx.fillRect(
 tcx,tcy,
 tcw,tch
 );
 }

 // DUST
 if( this.moveAnimationDustStep !== -1 ){

 var tileSize = TILE_LENGTH;
 scx = (BASESIZE*2)*this.moveAnimationDustStep;
 scy = 0;
 scw = BASESIZE*2;
 sch = BASESIZE*2;
 tcx = ( this.moveAnimationDustX )*tileSize -tileSize/2;
 tcy = ( this.moveAnimationDustY )*tileSize -tileSize/2;
 tcw = tileSize+tileSize;
 tch = tileSize+tileSize;

 view.canvasCtx.drawImage(
 this.moveAnimationDustPic,
 scx,scy,
 scw,sch,
 tcx,tcy,
 tcw,tch
 );
 }
 },

 isDone: function(){
 var done = (this.moveAnimationUid === -1);
 return done;
 }

 });

 */
/*
 view.registerAnimationHook({

 key:"trapwait_invoked",

 prepare: function( uid ){
 var unit = model.unit_data[ uid ];
 this.time = 0;
 this.xp = unit.x+1;
 this.yp = unit.y;
 this.x = (unit.x+1) * TILE_LENGTH;
 this.y = unit.y * TILE_LENGTH;
 },

 render: function(){
 var pic = view.getInfoImageForType("TRAPPED");
 view.canvasCtx.drawImage( pic, this.x, this.y );
 },

 update: function( delta ){
 this.time += delta;
 },

 isDone: function(){
 var res = this.time > 1000;
 if( res ){
 var pic = view.getInfoImageForType("TRAPPED");
 var y = this.yp;
 for( var i=this.xp,e=i+( parseInt(pic.width/TILE_LENGTH,10) ); i<=e; i++ ){
 view.redraw_markPos( i , y );
 }
 }
 return res;
 }

 });

 */