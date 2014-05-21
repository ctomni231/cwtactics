cwt.MapRenderer.MENU_ELEMENTS_MAX = 10;

/**
 * @constant
 * @type {number}
 */
cwt.MapRenderer.MENU_ENTRY_WIDTH = 10 * cwt.TILE_BASE;
/**
 * @constant
 * @type {number}
 */
cwt.MapRenderer.MENU_ENTRY_HEIGHT = 2 * cwt.TILE_BASE;

cwt.MapRenderer.layoutGenericMenu_ = new cwt.UIPositionableButtonGroup();

cwt.MapRenderer.$afterLoad = function () {

  // generate elements
  cwt.repeat(cwt.MapRenderer.MENU_ELEMENTS_MAX, function (i) {
    cwt.MapRenderer.layoutGenericMenu_.addElement(new cwt.UIField(
      0,
      i * 32,
      cwt.MapRenderer.MENU_ENTRY_WIDTH,
      cwt.MapRenderer.MENU_ENTRY_HEIGHT,
      "KEY_" + i,
      8,
      (i === 0 ? cwt.UIField.STYLE_NEW : (i === 9 ? cwt.UIField.STYLE_ESW : cwt.UIField.STYLE_EW)),

      // logic will be handled by the state machine
      cwt.emptyFunction
    ))
  });
};

/**
 * Renders the menu to the background layer of the UI canvas.
 *
 * @param {cwt.InterfaceMenu} menu
 */
cwt.MapRenderer.renderMenu = function (menu) {
  var layer = cwt.Screen.layerUI;
  var gfxMenu = cwt.MapRenderer.layoutGenericMenu_;
  var select = menu.getSelectedIndex();
  var numElements = menu.getSize();

  gfxMenu.setMenuPosition(
    parseInt((cwt.Screen.width / 2) - cwt.MapRenderer.MENU_ENTRY_WIDTH / 2, 10),
    parseInt((cwt.Screen.height / 2) - ((numElements * cwt.MapRenderer.MENU_ENTRY_HEIGHT) / 2), 10)
  );

  for (var i=0; i < cwt.MapRenderer.MENU_ELEMENTS_MAX; i++) {
    if (i < numElements) {
      gfxMenu.elements[i].inactive = false;
      gfxMenu.elements[i].text = cwt.Localization.forKey(menu.getContent(i));
    } else {
      gfxMenu.elements[i].inactive = true;
    }
  }

  // fix style --> normal when only one element is in the menu, else style_new
  gfxMenu.elements[0].style = (numElements === 1)? cwt.UIField.STYLE_NORMAL : cwt.UIField.STYLE_NEW;

  gfxMenu.draw(layer.getContext(0));
};