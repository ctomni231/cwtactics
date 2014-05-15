/**
 *
 * @param {cwt.InterfaceMenu} menu
 */
cwt.MapRenderer.renderMenu = function (menu) {
  var numElements = menu.getSize();
  var select = menu.getSelectedIndex();
  var sizeW = cwt.TILE_BASE * 10;
  var sizeH = numElements * (cwt.TILE_BASE + 4);
  var x = parseInt(cwt.Screen.width / 2 - sizeW / 2, 10);
  var y = parseInt(cwt.Screen.height / 2 - sizeH / 2, 10);

  // render elements
  for (var i = 0; i < numElements; i++) {
    var elContent = menu.getContent(i);
    var elEnabled = menu.isEnabled(i);
    var elSelected = (i === select);


  }
};