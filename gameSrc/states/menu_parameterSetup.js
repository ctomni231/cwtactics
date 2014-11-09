"use strict";

var constants = require("../constants");
var renderer = require("../renderer");
var widgets = require("../gui");
var config = require("../config");
var i18n = require("../localization");

var ENTRIES_PARAMETERS = 6;

var names;
var values;
var pageButton;

var configAttrPage = new renderer.Pagination(config.gameConfigNames, ENTRIES_PARAMETERS, function () {
  for (var i = 0, e = this.entries.length; i < e; i++) {
    names[i].text = (this.entries[i]) ? i18n.forKey(this.entries[i]) : "";
    values[i].text = (this.entries[i]) ? config.getValue(this.entries[i]).toString() : "";
  }

  pageButton.text = this.page.toString();
});


var changeConfigValue = function (index, left) {
  if (configAttrPage.entries[index]) {
    var name = configAttrPage.entries[index];
    var cfg = config.getConfig(name);

    if (left) {
      cfg.decreaseValue();
    } else {
      cfg.increaseValue();
    }

    values[index].text = config.getValue(name).toString();
  }
};

exports.state = {

  id: "PARAMETER_SETUP_SCREEN",

  enter: function () {
    configAttrPage.selectPage(0);
  },

  doLayout: function (layout) {
    var ENTRIES_PARAMETERS = 6;

    var h = parseInt((constants.SCREEN_HEIGHT - (8 + (ENTRIES_PARAMETERS * 2))) / 2, 10);
    var w = parseInt((constants.SCREEN_WIDTH - 18) / 2, 10);

    layout
      .addRowGap(h)

      // -------------------------------------------------------

      .repeat(ENTRIES_PARAMETERS, function (i) {
        var style1, style2, style3;

        if (i === 0) {
          style1 = widgets.UIField.STYLE_NEW;
          style2 = widgets.UIField.STYLE_NW;
          style3 = widgets.UIField.STYLE_NE;
        } else if (i === ENTRIES_PARAMETERS - 1) {
          style1 = widgets.UIField.STYLE_ESW;
          style2 = widgets.UIField.STYLE_SW;
          style3 = widgets.UIField.STYLE_ES;
        } else {
          style1 = widgets.UIField.STYLE_EW;
          style2 = widgets.UIField.STYLE_W;
          style3 = widgets.UIField.STYLE_E;
        }

        this
          .addColGap(w)
          .addButton(2, 2, 0, "MENU_LEFT", style1, 8, function () {
            changeConfigValue(i, true);
          })
          .addColGap(1)
          .addButton(8, 2, 0, "PARAMETER_CONFIG_" + i, style2, 8)
          .addButton(4, 2, 0, "PARAMETER_CONFIG_" + i + "_VALUE", style3, 8)
          .addColGap(1)
          .addButton(2, 2, 0, "MENU_RIGHT", style1, 8, function () {
            changeConfigValue(i, false);
          })
          .breakLine()
      })

      // -------------------------------------------------------

      .addRowGap(1)

      // -------------------------------------------------------

      .addColGap(w + 6)
      .addButton(2, 2, 0, "MENU_LEFT", widgets.UIField.STYLE_NSW, 8, function () {
        configAttrPage.selectPage(configAttrPage.page - 1);
      })
      .addButton(2, 2, 0, "PARAMETER_CONFIG_PAGE", widgets.UIField.STYLE_NS, 8)
      .addButton(2, 2, 0, "MENU_RIGHT", widgets.UIField.STYLE_NES, 8, function () {
        configAttrPage.selectPage(configAttrPage.page + 1);
      })
      .breakLine()

      // -------------------------------------------------------

      .addRowGap(3)

      // -------------------------------------------------------

      .addColGap(w)
      .addButton(5, 2, 0, "MENU_BACK", widgets.UIField.STYLE_NORMAL, 8, function () {
        this.changeState("PLAYER_SETUP_SCREEN");
      })
      .addColGap(8)
      .addButton(5, 2, 0, "MENU_NEXT", widgets.UIField.STYLE_NORMAL, 8, function () {
        this.changeState("INGAME_ENTER");
      })
      .breakLine();


    names = layout.getButtonsByReg(/(PARAMETER_CONFIG_)(\d+)$/);
    values = layout.getButtonsByReg(/(PARAMETER_CONFIG_)(\d+)(_VALUE)$/);
    pageButton = layout.getButtonByKey("PARAMETER_CONFIG_PAGE");
  }
};