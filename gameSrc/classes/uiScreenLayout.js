/**
 * A screen layout is a group out of ui elements. This elements can be interactive or non-interactive. It should
 * be used to create and define a screen layout. Furthermore the screen layout offers API to interact with the
 * components.
 *
 * @class
 */
cwt.UIScreenLayout = my.Class(/** @lends cwt.UIScreenLayout.prototype */ {

  constructor: function (slotsX, slotsY) {
    this.elements = [];
    this.selected = -1;

    this.curX = 0;
    this.curY = 0;
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
    this.curX = 0;
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

    this.elements.push(btn);
    if (this.selected === -1 && action) {
      this.elements[this.elements.length - 1].inFocus = true;
      this.selected = this.elements.length - 1;
    }

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

    this.elements.push(btn);

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

    this.elements.push(btn);
    if (this.selected === -1 && action) {
      this.elements[this.elements.length - 1].inFocus = true;
      this.selected = this.elements.length - 1;
    }

    return this;
  },

  /**
   * Returns the current active button.
   *
   * @return {cwt.UIField}
   */
  activeButton: function () {
    return this.elements[this.selected];
  },

  /**
   * Returns a button by it's key.
   *
   * @param {String} key
   * @return {cwt.UIField}
   */
  getButtonByKey: function (key) {
    for (var i = 0, e = this.elements.length; i < e; i++) {
      if (this.elements[i].key === key) {
        return this.elements[i];
      }
    }
    return null;
  },

  /**
   *
   * @param {RegExp} reg
   */
  getButtonsByReg: function (reg) {
    var arr = [];

    for (var i = 0, e = this.elements.length; i < e; i++) {
      if (reg.test(this.elements[i].key)) {
        arr.push(this.elements[i]);
      }
    }

    return arr;
  },

  /**
   * Updates the index of the selected button in interconnection to a given position.
   *
   * @param {Number} x
   * @param {Number} y
   * @return {boolean} true, if the index was updated, else false
   */
  updateIndex: function (x, y) {
    for (var i = 0, e = this.elements.length; i < e; i++) {

      // inactive element
      if (!this.elements[i].action) {
        continue;
      }

      if (this.elements[i].positionInButton(x, y)) {
        if (i === this.selected) {
          return false;
        }

        this.elements[this.selected].inFocus = false;
        this.selected = i;
        this.elements[this.selected].inFocus = true;

        return true;
      }
    }
    return false;
  },

  /**
   *
   * @param input
   * @return {boolean} true, if the index was updated, else false
   */
  handleInput: function (input) {
    if (cwt.DEBUG) cwt.assert(input !== null);

    var res = true;
    this.elements[this.selected].inFocus = false;

    switch (input.key) {
      case cwt.Input.TYPE_UP:
      case cwt.Input.TYPE_LEFT:
        do {
          this.selected--;
          if (this.selected < 0) {
            this.selected = this.elements.length - 1;
          }
        } while (!this.elements[this.selected].action);
        break;

      case cwt.Input.TYPE_RIGHT:
      case cwt.Input.TYPE_DOWN:
        do {
          this.selected++;
          if (this.selected >= this.elements.length) {
            this.selected = 0;
          }
        } while (!this.elements[this.selected].action);
        break;

      default :
        res = false;
    }

    this.elements[this.selected].inFocus = true;

    return res;
  },

  /**
   * Draws the screen layout into a given context of a canvas object.
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  draw: function (ctx) {
    for (var i = 0, e = this.elements.length; i < e; i++) {
      this.elements[i].draw(ctx);
    }
  }
});