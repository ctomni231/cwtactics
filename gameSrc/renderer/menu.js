"use strict";

var constants = require("../constants");

var MENU_ELEMENTS_MAX = 10;
var MENU_ENTRY_HEIGHT = 2 * constants.TILE_BASE;
var MENU_ENTRY_WIDTH = 10 * constants.TILE_BASE;

var functions = require("../functions");
var widgets = require("../uiWidgets");
var i18n = require("../localization");

var layoutGenericMenu = new widgets.UIPositionableButtonGroup();

// fill layout
functions.repeat(MENU_ELEMENTS_MAX, function (i) {
  layoutGenericMenu.addElement(new widgets.UIField(
    0,
    i * 32,
    MENU_ENTRY_WIDTH,
    MENU_ENTRY_HEIGHT,
    "KEY_" + i,
    8,
    widgets.UIField.STYLE_NORMAL,

    // logic will be handled by the state machine
    functions.emptyFunction
  ))
});

//
// Renders the menu to the background layer of the UI canvas.
//
exports.prepareMenu = function (layer, screenWidth, screenHeight, menu) {
  var gfxMenu = layoutGenericMenu;
  var numElements = menu.getSize();

  gfxMenu.setMenuPosition(
    parseInt((screenWidth / 2) - MENU_ENTRY_WIDTH / 2, 10),
    parseInt((screenHeight / 2) - ((numElements * MENU_ENTRY_HEIGHT) / 2), 10)
  );

  for (var i=0; i < MENU_ELEMENTS_MAX; i++) {
    if (i < numElements) {
      gfxMenu.elements[i].inactive = false;
      gfxMenu.elements[i].text = i18n.forKey(menu.getContent(i));

      // set style
      gfxMenu.elements[i].style = (
        (numElements === 1 ? widgets.UIField.STYLE_NORMAL :
          (i === 0 ? widgets.UIField.STYLE_NEW :
            (i === numElements-1 ? widgets.UIField.STYLE_ESW : widgets.UIField.STYLE_EW)))
        );

    } else {
      gfxMenu.elements[i].inactive = true;
    }
  }

  exports.renderMenu(layer);
};

exports.renderMenu = function (layer) {
  layoutGenericMenu.draw(layer.getContext(0));
};

exports.updateMenuIndex = function (x, y) {
  layoutGenericMenu.updateMenuIndex(x,y);
};

exports.getMenuIndex = function () {
  return layoutGenericMenu.selected;
};

exports.handleMenuInput = function (code) {
  return layoutGenericMenu.handleInput(code);
};