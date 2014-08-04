var constants = require("../constants");
var functions = require("../functions");
var renderer = require("../renderer");
var i18n = require("../localization");

var MENU_ELEMENTS_MAX = 10;
var MENU_ENTRY_HEIGHT = 2 * constants.TILE_BASE;
var MENU_ENTRY_WIDTH = 10 * constants.TILE_BASE;

var layoutGenericMenu = new renderer.UIPositionableButtonGroup();

// fill layout
functions.repeat(MENU_ELEMENTS_MAX, function (i) {
  layoutGenericMenu.addElement(new renderer.UIField(
    0,
    i * 32,
    MENU_ENTRY_WIDTH,
    MENU_ENTRY_HEIGHT,
    "KEY_" + i,
    8,
    renderer.UIField.STYLE_NORMAL,

    // logic will be handled by the state machine
    functions.emptyFunction
  ))
});

//
// Renders the menu to the background layer of the UI canvas.
//
exports.prepareMenu = function (menu) {
  var gfxMenu = layoutGenericMenu;
  var select = menu.getSelectedIndex();
  var numElements = menu.getSize();

  gfxMenu.setMenuPosition(
    parseInt((cwt.Screen.width / 2) - MENU_ENTRY_WIDTH / 2, 10),
    parseInt((cwt.Screen.height / 2) - ((numElements * MENU_ENTRY_HEIGHT) / 2), 10)
  );

  for (var i=0; i < MENU_ELEMENTS_MAX; i++) {
    if (i < numElements) {
      gfxMenu.elements[i].inactive = false;
      gfxMenu.elements[i].text = i18n.forKey(menu.getContent(i));

      // set style
      gfxMenu.elements[i].style = (
        (numElements === 1 ? renderer.UIField.STYLE_NORMAL :
          (i === 0 ? renderer.UIField.STYLE_NEW :
            (i === numElements-1 ? renderer.UIField.STYLE_ESW : renderer.UIField.STYLE_EW)))
        );

    } else {
      gfxMenu.elements[i].inactive = true;
    }
  }

  this.renderMenu(menu);
};

exports.renderMenu = function (menu) {
  layoutGenericMenu.draw(cwt.Screen.layerUI.getContext(0));
};