/**
 * A screen layout is a group out of ui elements. This elements can be interactive or non-interactive. It should
 * be used to create and define a screen layout. Furthermore the screen layout offers API to interact with the
 * components.
 *
 * @class
 * @extends {cwt.UIButtonGroup}
 */
cwt.UIScreenLayout = my.Class( null, cwt.UIButtonGroup, /** @lends cwt.UIScreenLayout.prototype */ {

  constructor: function (slotsX, slotsY, startX, startY) {
    cwt.UIButtonGroup.call(this);

    this.left = startX || 0;
    this.curX = startX || 0;
    this.curY = startY || 0;
    this.curH = 0;

    this.breakLine();
  },

  /**
   *
   * @param f
   */
  repeat: function (n,f) {
    for (var i = 0; i < n; i++) {
      f.call(this,i);
    }
    return this;
  },

  /**
   *
   * @param tiles
   */
  addRowGap: function (tiles) {
    this.curY += cwt.TILE_BASE*tiles;
    return this;
  },

  /**
   *
   * @param tiles
   */
  addColGap: function (tiles) {
    this.curX += cwt.TILE_BASE*tiles;
    return this;
  },

  /**
   * Breaks the current line
   */
  breakLine: function () {
    this.curX = this.left;
    this.curY += this.curH*cwt.TILE_BASE;
    this.curH = 1;
    return this;
  },

  /**
   *
   * @param {Number} tilesX
   * @param {Number} tilesY
   * @param {Number} offsetY
   * @param {Number} style
   * @param key
   * @param {Function?} action
   * @return {cwt.UIScreenLayout}
   */
  addButton: function (tilesX, tilesY, offsetY, key, style, fSize, action) {
    if (arguments.length === 5) {
      action = null;
      fSize = 12;
    } else if (arguments.length === 6 && typeof fSize === "function") {
      action = fSize;
      fSize = 12;
    }

    if (this.curH < tilesY) {
      this.curH = tilesY;
    }

    var btn = new cwt.UIField(
      this.curX,
      this.curY + (offsetY*cwt.TILE_BASE),
      tilesX*cwt.TILE_BASE,
      tilesY*cwt.TILE_BASE,
      key,
      fSize,
      style,
      action
    );

    this.curX += tilesX*cwt.TILE_BASE;

    this.addElement(btn);

    return this;
  },

  /**
   *
   * @param {Number} tilesX
   * @param {Number} tilesY
   * @param {Number} offsetY
   * @param key
   * @param {Function?} draw
   * @param {boolean?} ignoreHeight
   * @return {cwt.UIScreenLayout}
   */
  addCustomField: function (tilesX, tilesY, offsetY, key, draw, ignoreHeight) {
    if (ignoreHeight != true && this.curH < tilesY) {
      this.curH = tilesY;
    }

    var btn = new cwt.UICustomField(
      this.curX,
      this.curY + (offsetY*cwt.TILE_BASE),
      tilesX*cwt.TILE_BASE,
      tilesY*cwt.TILE_BASE,
      key,
      draw
    );

    this.curX += tilesX*cwt.TILE_BASE;

    this.addElement(btn);

    return this;
  },

  /**
   *
   * @param {Number} tilesX
   * @param {Number} tilesY
   * @param {Number} offsetY
   * @param {Number} style
   * @param key
   * @return {cwt.UIScreenLayout}
   */
  addCheckbox: function (tilesX, tilesY, offsetY, key, style, fSize) {
    if (arguments.length === 5) {
      fSize = 12;
    } else if (arguments.length === 6 && typeof fSize === "function") {
      fSize = 12;
    }

    if (this.curH < tilesY) {
      this.curH = tilesY;
    }

    var btn = new cwt.UICheckboxField(
      this.curX,
      this.curY + (offsetY*cwt.TILE_BASE),
      tilesX*cwt.TILE_BASE,
      tilesY*cwt.TILE_BASE,
      key,
      fSize,
      style
    );

    this.curX += tilesX*cwt.TILE_BASE;

    this.addElement(btn);

    return this;
  }
});