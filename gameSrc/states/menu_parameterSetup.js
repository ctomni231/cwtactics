require("../statemachine").addMenuState({

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
        require("../statemachine").changeState("PLAYER_SETUP_SCREEN");
      })
      .addColGap(8)
      .addButton(5, 2, 0, "MENU_NEXT", cwt.UIField.STYLE_NORMAL, 8, function () {
        require("../statemachine").changeState("INGAME_ENTER");
      })
      .breakLine();
  }
});