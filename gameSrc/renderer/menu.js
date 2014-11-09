/**
 *
 *
 * @module
 */

"use strict";

var constants = require("../constants");

var MENU_ELEMENTS_MAX = 10;
var MENU_ENTRY_HEIGHT = 2 * constants.TILE_BASE;
var MENU_ENTRY_WIDTH = 10 * constants.TILE_BASE;

var functions = require("../system/functions");
var widgets = require("../gui");
var i18n = require("../localization");
var input = require("../input");

var layoutGenericMenu = new widgets.UIPositionableButtonGroup();

var menuShift = 0;

// fill layout
functions.repeat(MENU_ELEMENTS_MAX, function(i) {
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

exports.resetShift = function() {
  menuShift = 0;
};

//
// Renders the menu to the background layer of the UI canvas.
//
exports.prepareMenu = function(layer, screenWidth, screenHeight, menu) {
  var gfxMenu = layoutGenericMenu;
  var numElements = menu.getSize();
  if (numElements > MENU_ELEMENTS_MAX) numElements = MENU_ELEMENTS_MAX;

  // set the position of the menu
  gfxMenu.setMenuPosition(
    parseInt((screenWidth / 2) - MENU_ENTRY_WIDTH / 2, 10),
    parseInt((screenHeight / 2) - ((numElements * MENU_ENTRY_HEIGHT) / 2), 10)
  );

  for (var i = 0; i < MENU_ELEMENTS_MAX; i++) {
    if (i < numElements) {
      gfxMenu.elements[i].inactive = false;
      gfxMenu.elements[i].text = i18n.forKey(menu.getContent(menuShift + i));

      // set style
      gfxMenu.elements[i].style = (
        (numElements === 1 ? widgets.UIField.STYLE_NORMAL :
          (i === 0 ? widgets.UIField.STYLE_NEW :
            (i === numElements - 1 || i === menuShift + MENU_ELEMENTS_MAX - 1 ? widgets.UIField.STYLE_ESW :
              widgets.UIField.STYLE_EW)))
      );

    } else {
      gfxMenu.elements[i].inactive = true;
    }
  }

  exports.renderMenu(layer);
};

exports.renderMenu = function(layer) {
  layoutGenericMenu.draw(layer.getContext(0));
};

exports.updateMenuIndex = function(x, y) {
  layoutGenericMenu.updateIndex(x, y);
  // TODO -> when the index is at the boundaries then change page if necessary
};

exports.getMenuIndex = function() {
  return menuShift + layoutGenericMenu.selected;
};

exports.handleMenuInput = function(menu, code) {
  var shiftedMenu = false;

  // the menu size must be greater then the menu size
  if (menu.getSize() > MENU_ELEMENTS_MAX) {
    var currentIndex = layoutGenericMenu.selected;

    switch (code) {
      case input.TYPE_UP:
        if (currentIndex < 2 && menuShift > 0) {
          shiftedMenu = true;
          menuShift--;
        } else if (currentIndex === 0 && menuShift === 0) {
          shiftedMenu = true;
          menuShift = menu.getSize() - MENU_ELEMENTS_MAX;
          layoutGenericMenu.setIndex(MENU_ELEMENTS_MAX - 1);
        }
        break;

      case input.TYPE_DOWN:
        if (currentIndex > MENU_ELEMENTS_MAX - 3 && menuShift < menu.getSize() - MENU_ELEMENTS_MAX) {
          shiftedMenu = true;
          menuShift++;
        } else if (currentIndex === MENU_ELEMENTS_MAX - 1 && menuShift === menu.getSize() - MENU_ELEMENTS_MAX) {
          shiftedMenu = true;
          menuShift = 0;
          layoutGenericMenu.setIndex(0);
        }
        break;
    }
  }

  return (shiftedMenu) ? 2 : (layoutGenericMenu.handleInput(code) === true? 1 : 0);
};
