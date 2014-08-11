var constants = require("./constants");
var assert = require("./functions").assert;
var input = require("./input");
var i18n = require("./localization");

//
//
// @class
//
exports.UIField = my.Class({

  STATIC: {
    STYLE_NONE: -1,
    STYLE_NORMAL: 0,
    STYLE_S: 1,
    STYLE_N: 2,
    STYLE_W: 3,
    STYLE_E: 4,
    STYLE_NE: 5,
    STYLE_NW: 6,
    STYLE_ES: 7,
    STYLE_SW: 8,
    STYLE_EW: 13,
    STYLE_NS: 14,
    STYLE_ESW: 9,
    STYLE_NEW: 10,
    STYLE_NSW: 11,
    STYLE_NES: 12
  },

  constructor: function (x, y, w, h, text, fsize, style, actionFn) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.fsize = fsize;
    this.style = style;
    this.inFocus = false;
    this.action = actionFn;
    this.inactive = false;

    this.key = text;
    this.text = (text) ? i18n.forKey(text) : text;
    if (this.text.search(/\n/) !== -1) {
      this.text = this.text.split("\n");
    }
  },

  //
  //
  // @param x
  // @param y
  // @return {boolean}
  //
  positionInButton: function (x, y) {
    return (x >= this.x && x < this.x + this.width && y >= this.y && y < this.y + this.height);
  },

  erase: function (ctx) {
    ctx.clearRect(this.x, this.y, this.width, this.height);
  },

  //
  //
  // @param {CanvasRenderingContext2D} ctx
  //
  draw: function (ctx) {
    if (this.style === exports.UIField.STYLE_NONE) {
      return;
    }

    ctx.fillStyle = (this.inFocus) ? "rgb(220,220,220)" : "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // draw borders
    ctx.fillStyle = "rgb(60,60,60)";
    switch (this.style) {

      case exports.UIField.STYLE_NORMAL:
        ctx.fillRect(this.x + 1, this.y + 1, this.width - 2, this.height - 2);
        ctx.fillStyle = (this.inFocus) ? "rgb(220,220,220)" : "white";
        ctx.fillRect(this.x + 3, this.y + 3, this.width - 6, this.height - 6);
        break;

      case exports.UIField.STYLE_N:
        ctx.fillRect(this.x, this.y + 1, this.width, 2);
        break;

      case exports.UIField.STYLE_E:
        ctx.fillRect(this.x + this.width - 3, this.y, 2, this.height);
        break;

      case exports.UIField.STYLE_S:
        ctx.fillRect(this.x, this.y + this.height - 3, this.width, 2);
        break;

      case exports.UIField.STYLE_W:
        ctx.fillRect(this.x + 1, this.y, 2, this.height);
        break;

      case exports.UIField.STYLE_NE:
        ctx.fillRect(this.x, this.y + 1, this.width - 1, 2);
        ctx.fillRect(this.x + this.width - 3, this.y + 1, 2, this.height - 1);
        break;

      case exports.UIField.STYLE_NW:
        ctx.fillRect(this.x + 1, this.y + 1, this.width, 2);
        ctx.fillRect(this.x + 1, this.y + 1, 2, this.height - 1);
        break;

      case exports.UIField.STYLE_ES:
        ctx.fillRect(this.x + this.width - 3, this.y, 2, this.height - 1);
        ctx.fillRect(this.x, this.y + this.height - 3, this.width - 1, 2);
        break;

      case exports.UIField.STYLE_SW:
        ctx.fillRect(this.x + 1, this.y + this.height - 3, this.width - 1, 2);
        ctx.fillRect(this.x + 1, this.y, 2, this.height - 1);
        break;

      case exports.UIField.STYLE_EW:
        ctx.fillRect(this.x + this.width - 3, this.y, 2, this.height);
        ctx.fillRect(this.x + 1, this.y, 2, this.height);
        break;

      case exports.UIField.STYLE_NS:
        ctx.fillRect(this.x, this.y + 1, this.width, 2);
        ctx.fillRect(this.x, this.y + this.height - 3, this.width, 2);
        break;

      case exports.UIField.STYLE_ESW:
        ctx.fillRect(this.x + this.width - 3, this.y, 2, this.height - 1);
        ctx.fillRect(this.x + 1, this.y + this.height - 3, this.width - 2, 2);
        ctx.fillRect(this.x + 1, this.y, 2, this.height - 1);
        break;

      case exports.UIField.STYLE_NEW:
        ctx.fillRect(this.x + 1, this.y + 1, this.width - 2, 2);
        ctx.fillRect(this.x + this.width - 3, this.y + 1, 2, this.height - 1);
        ctx.fillRect(this.x + 1, this.y + 1, 2, this.height - 1);
        break;

      case exports.UIField.STYLE_NSW:
        ctx.fillRect(this.x + 1, this.y + 1, this.width - 1, 2);
        ctx.fillRect(this.x + 1, this.y + this.height - 3, this.width - 1, 2);
        ctx.fillRect(this.x + 1, this.y + 1, 2, this.height - 2);
        break;

      case exports.UIField.STYLE_NES:
        ctx.fillRect(this.x, this.y + 1, this.width - 1, 2);
        ctx.fillRect(this.x + this.width - 3, this.y + 1, 2, this.height - 2);
        ctx.fillRect(this.x, this.y + this.height - 3, this.width - 1, 2);
        break;
    }

    ctx.fillStyle = "black";
    ctx.font = this.fsize + "pt " + constants.GAME_FONT;

    var tw;
    if (this.text) {
      if (typeof this.text === "string") {
        tw = ctx.measureText(this.text);
        ctx.fillText(
          this.text,
          this.x + (this.width / 2) - (tw.width / 2),
          this.y + (this.height / 2) + this.fsize / 2);
      } else {
        for (var i = 0, e = this.text.length; i < e; i++) {
          tw = ctx.measureText(this.text[i]);
          ctx.fillText(
            this.text[i],
            this.x + (this.width / 2) - (tw.width / 2),
            this.y + this.fsize + ((i + 1) * (this.fsize + 8)));
        }
      }
    }
  }
});

//
//
// @class
// @extends {cwt.UIField}
//
exports.UICustomField = my.Class(null, exports.UIField, {

  constructor: function (x, y, w, h, key, drawFn) {
    exports.UIField.call(this, x, y, w, h, key, 0, exports.UIField.STYLE_NORMAL);
    this.text = "";
    this.draw = drawFn;
  }
});

//
// @class
//
exports.UIButtonGroup = my.Class({

  constructor: function () {
    this.elements = [];
    this.selected = -1;
  },

  //
  //
  // @param {cwt.UIField} el
  //
  addElement: function (el) {
    this.elements.push(el);
    if (this.selected === -1 && el.action) {
      this.elements[this.elements.length - 1].inFocus = true;
      this.selected = this.elements.length - 1;
    }
  },

  //
  // Returns the current active button.
  //
  // @return {cwt.UIField}
  //
  activeButton: function () {
    return this.elements[this.selected];
  },

  //
  // Returns a button by it's key.
  //
  // @param {String} key
  // @return {cwt.UIField}
  //
  getButtonByKey: function (key) {
    for (var i = 0, e = this.elements.length; i < e; i++) {
      if (this.elements[i].key === key) {
        return this.elements[i];
      }
    }
    return null;
  },

  //
  //
  // @param {RegExp} reg
  //
  getButtonsByReg: function (reg) {
    var arr = [];

    for (var i = 0, e = this.elements.length; i < e; i++) {
      if (reg.test(this.elements[i].key)) {
        arr.push(this.elements[i]);
      }
    }

    return arr;
  },

  //
  // Updates the index of the selected button in interconnection to a given position.
  //
  // @param {Number} x
  // @param {Number} y
  // @return {boolean} true, if the index was updated, else false
  //
  updateIndex: function (x, y) {
    for (var i = 0, e = this.elements.length; i < e; i++) {

      // inactive element
      if (!this.elements[i].action || this.elements[i].inactive) {
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

  //
  //
  // @param input
  // @return {boolean} true, if the index was updated, else false
  //
  handleInput: function (inputData) {
    if (constants.DEBUG) assert(input !== null);

    if (typeof inputData !== "number") {
      inputData = inputData.key;
    }

    var res = true;
    this.elements[this.selected].inFocus = false;

    switch (inputData) {
      case input.TYPE_UP:
      case input.TYPE_LEFT:
        do {
          this.selected--;
          if (this.selected < 0) {
            this.selected = this.elements.length - 1;
          }
        } while (!this.elements[this.selected].action || this.elements[this.selected].inactive);
        break;

      case input.TYPE_RIGHT:
      case input.TYPE_DOWN:
        do {
          this.selected++;
          if (this.selected >= this.elements.length) {
            this.selected = 0;
          }
        } while (!this.elements[this.selected].action || this.elements[this.selected].inactive);
        break;

      default:
        res = false;
    }

    this.elements[this.selected].inFocus = true;

    return res;
  },

  //
  // Draws the screen layout into a given context of a canvas object.
  //
  // @param {CanvasRenderingContext2D} ctx
  //
  draw: function (ctx) {
    for (var i = 0, e = this.elements.length; i < e; i++) {
      var el = this.elements[i];

      if (!el.inactive) {
        el.draw(ctx);
      }
    }
  }
});

//
//
// @class
// @extends {cwt.UIField}
//
exports.UICheckboxField = my.Class(null, exports.UIField, {

  constructor: function (x, y, w, h, text, fsize, style) {
    exports.UIField.call(this, x, y, w, h, text, fsize, style, function (button, state) {
      state.rendered = false;
      button.checked = !button.checked;
    });

    this.text = "";
    this.checked = false;
  },

  //
  //
  // @param {CanvasRenderingContext2D} ctx
  //
  draw: function (ctx) {
    exports.UIField.prototype.draw.call(this, ctx);

    ctx.fillStyle = "black";
    ctx.fillRect(this.x + 4, this.y + 4, this.width - 8, this.height - 8);

    ctx.fillStyle = (this.checked) ? "rgb(60,60,60)" : "white";
    ctx.fillRect(this.x + 5, this.y + 5, this.width - 10, this.height - 10);
  }
});

//
// A screen layout is a group out of ui elements. This elements can be interactive or non-interactive. It should
// be used to create and define a screen layout. Furthermore the screen layout offers API to interact with the
// components.
//
// @class
// @extends {cwt.UIButtonGroup}
//
exports.UIScreenLayout = my.Class(null, exports.UIButtonGroup, {

  constructor: function (slotsX, slotsY, startX, startY) {
    exports.UIButtonGroup.call(this);

    this.left = startX || 0;
    this.curX = startX || 0;
    this.curY = startY || 0;
    this.curH = 0;

    this.breakLine();
  },

  //
  //
  // @param f
  //
  repeat: function (n, f) {
    for (var i = 0; i < n; i++) {
      f.call(this, i);
    }
    return this;
  },

  //
  //
  // @param tiles
  //
  addRowGap: function (tiles) {
    this.curY += constants.TILE_BASE * tiles;
    return this;
  },

  //
  //
  // @param tiles
  //
  addColGap: function (tiles) {
    this.curX += constants.TILE_BASE * tiles;
    return this;
  },

  //
  // Breaks the current line
  //
  breakLine: function () {
    this.curX = this.left;
    this.curY += this.curH * constants.TILE_BASE;
    this.curH = 1;
    return this;
  },

  //
  //
  // @param {Number} tilesX
  // @param {Number} tilesY
  // @param {Number} offsetY
  // @param {Number} style
  // @param key
  // @param {Function?} action
  // @return {cwt.UIScreenLayout}
  //
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

    var btn = new exports.UIField(
      this.curX,
      this.curY + (offsetY * constants.TILE_BASE),
      tilesX * constants.TILE_BASE,
      tilesY * constants.TILE_BASE,
      key,
      fSize,
      style,
      action
    );

    this.curX += tilesX * constants.TILE_BASE;

    this.addElement(btn);

    return this;
  },

  //
  //
  // @param {Number} tilesX
  // @param {Number} tilesY
  // @param {Number} offsetY
  // @param key
  // @param {Function?} draw
  // @param {boolean?} ignoreHeight
  // @return {cwt.UIScreenLayout}
  //
  addCustomField: function (tilesX, tilesY, offsetY, key, draw, ignoreHeight) {
    if (ignoreHeight != true && this.curH < tilesY) {
      this.curH = tilesY;
    }

    var btn = new exports.UICustomField(
      this.curX,
      this.curY + (offsetY * constants.TILE_BASE),
      tilesX * constants.TILE_BASE,
      tilesY * constants.TILE_BASE,
      key,
      draw
    );

    this.curX += tilesX * constants.TILE_BASE;

    this.addElement(btn);

    return this;
  },

  //
  //
  // @param {Number} tilesX
  // @param {Number} tilesY
  // @param {Number} offsetY
  // @param {Number} style
  // @param key
  // @return {cwt.UIScreenLayout}
  //
  addCheckbox: function (tilesX, tilesY, offsetY, key, style, fSize) {
    if (arguments.length === 5) {
      fSize = 12;
    } else if (arguments.length === 6 && typeof fSize === "function") {
      fSize = 12;
    }

    if (this.curH < tilesY) {
      this.curH = tilesY;
    }

    var btn = new exports.UICheckboxField(
      this.curX,
      this.curY + (offsetY * constants.TILE_BASE),
      tilesX * constants.TILE_BASE,
      tilesY * constants.TILE_BASE,
      key,
      fSize,
      style
    );

    this.curX += tilesX * constants.TILE_BASE;

    this.addElement(btn);

    return this;
  }
});

//
// @class
// @extends {cwt.UIButtonGroup}
//
exports.UIPositionableButtonGroup = my.Class(null, exports.UIButtonGroup, {

  constructor: function () {
    exports.UIButtonGroup.call(this);
    this.x = 0;
    this.y = 0;
  },

  setMenuPosition: function (x, y) {
    var diffX = x - this.x;
    var diffY = y - this.y;

    for (var i = 0, e = this.elements.length; i < e; i++) {
      var element = this.elements[i];

      element.x += diffX;
      element.y += diffY;
    }

    this.x = x;
    this.y = y;
  }
});
