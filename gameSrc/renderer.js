//
//
// @class
//
exports.LayerObject = my.Class({

  constructor: function (config) {
    this.canvas = null;
    this.frames = [];
    this.ctx = [];
    this.cFrame = 0;
    this.cTime = 0;
    this.frameLimit = config.time;

    this.drawAll = null;
    this.draw = null;

    // create canvas objects
    var n = 0;
    while (n < frames) {
      this.canvas[n] = document.createElement("canvas");
      this.ctx[n] = this.canvas[n].getContext("2d");
      n++;
    }
  },

  //
  //
  renderFrame: function (frame) {
    var curCanvas = this.frames[frame];
    this.canvas.getContext("2d").drawImage(curCanvas,0,0,curCanvas.width,curCanvas.height);
  },

  //
  // Hides a layer.
  //
  hide: function () {
    this.canvas.style.display = "none";
  },

  //
  // Shows a layer.
  //
  show: function () {
    this.canvas.style.display = "block";
  },

  //
  // Returns the current active canvas of the layer.
  //
  // @return {HTMLCanvasElement}
  //
  getActiveFrame: function () {
    return this.canvas[this.cFrame];
  },

  //
  // Returns the rendering context for a given frame id.
  //
  // @param {number=} frame
  // @return {CanvasRenderingContext2D}
  //
  getContext: function (frame) {
    if (arguments.length === 0) {
      frame = 0;
    }

    if (this.DEBUG) cwt.assert(frame >= 0 && frame < this.canvas.length);

    return this.ctx[frame];
  },

  //
  // Updates the internal timer of the layer.
  //
  // @param delta
  //
  update: function (delta) {
    this.cTime += delta;

    // increase frame
    if (this.cTime >= this.frameLimit) {
      this.cTime = 0;
      this.cFrame++;

      // reset frame
      if (this.cFrame === this.canvas.length) {
        this.cFrame = 0;
      }
    }
  },

  //
  // Resets timer and frame counter.
  //
  resetTimer: function () {
    this.cTime = 0;
    this.cFrame = 0;
  }

});

//
// @class
//
exports.PaginationObject = my.Class({

  constructor: function(list, pageSize, updateFn) {
    this.page = 0;
    this.list = list;

    this.entries = [];
    while (pageSize > 0) {
      this.entries.push(null);
      pageSize--;
    }

    this.updateFn = updateFn;
  },

  //
  // Selects a page from the list. The entries of the selected page will be saved in the **entries** property
  // of the pagination object.
  //
  selectPage: function(index) {
    var PAGE_SIZE = this.entries.length;

    if (index < 0 || index * PAGE_SIZE >= this.list.length) {
      return;
    }

    this.page = index;

    index = (index * PAGE_SIZE);
    for (var n = 0; n < PAGE_SIZE; n++) {
      this.entries[n] = (index + n >= this.list.length) ? null : this.list[index + n];
    }

    if (this.updateFn) {
      this.updateFn();
    }
  }

});

//
//
// @class
//
exports.UIFieldObject = my.Class({

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

  constructor: function(x, y, w, h, text, fsize, style, actionFn) {
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
    this.text = (text) ? cwt.Localization.forKey(text) : text;
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
  positionInButton: function(x, y) {
    return (x >= this.x && x < this.x + this.width && y >= this.y && y < this.y + this.height);
  },

  erase: function(ctx) {
    ctx.clearRect(this.x, this.y, this.width, this.height);
  },

  //
  //
  // @param {CanvasRenderingContext2D} ctx
  //
  draw: function(ctx) {
    if (this.style === cwt.UIField.STYLE_NONE) {
      return;
    }

    ctx.fillStyle = (this.inFocus) ? "rgb(220,220,220)" : "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // draw borders
    ctx.fillStyle = "rgb(60,60,60)";
    switch (this.style) {

      case exports.UIFieldObject.STYLE_NORMAL:
        ctx.fillRect(this.x + 1, this.y + 1, this.width - 2, this.height - 2);
        ctx.fillStyle = (this.inFocus) ? "rgb(220,220,220)" : "white";
        ctx.fillRect(this.x + 3, this.y + 3, this.width - 6, this.height - 6);
        break;

      case exports.UIFieldObject.STYLE_N:
        ctx.fillRect(this.x, this.y + 1, this.width, 2);
        break;

      case exports.UIFieldObject.STYLE_E:
        ctx.fillRect(this.x + this.width - 3, this.y, 2, this.height);
        break;

      case exports.UIFieldObject.STYLE_S:
        ctx.fillRect(this.x, this.y + this.height - 3, this.width, 2);
        break;

      case exports.UIFieldObject.STYLE_W:
        ctx.fillRect(this.x + 1, this.y, 2, this.height);
        break;

      case exports.UIFieldObject.STYLE_NE:
        ctx.fillRect(this.x, this.y + 1, this.width - 1, 2);
        ctx.fillRect(this.x + this.width - 3, this.y + 1, 2, this.height - 1);
        break;

      case exports.UIFieldObject.STYLE_NW:
        ctx.fillRect(this.x + 1, this.y + 1, this.width, 2);
        ctx.fillRect(this.x + 1, this.y + 1, 2, this.height - 1);
        break;

      case exports.UIFieldObject.STYLE_ES:
        ctx.fillRect(this.x + this.width - 3, this.y, 2, this.height - 1);
        ctx.fillRect(this.x, this.y + this.height - 3, this.width - 1, 2);
        break;

      case exports.UIFieldObject.STYLE_SW:
        ctx.fillRect(this.x + 1, this.y + this.height - 3, this.width - 1, 2);
        ctx.fillRect(this.x + 1, this.y, 2, this.height - 1);
        break;

      case exports.UIFieldObject.STYLE_EW:
        ctx.fillRect(this.x + this.width - 3, this.y, 2, this.height);
        ctx.fillRect(this.x + 1, this.y, 2, this.height);
        break;

      case exports.UIFieldObject.STYLE_NS:
        ctx.fillRect(this.x, this.y + 1, this.width, 2);
        ctx.fillRect(this.x, this.y + this.height - 3, this.width, 2);
        break;

      case exports.UIFieldObject.STYLE_ESW:
        ctx.fillRect(this.x + this.width - 3, this.y, 2, this.height - 1);
        ctx.fillRect(this.x + 1, this.y + this.height - 3, this.width - 2, 2);
        ctx.fillRect(this.x + 1, this.y, 2, this.height - 1);
        break;

      case exports.UIFieldObject.STYLE_NEW:
        ctx.fillRect(this.x + 1, this.y + 1, this.width - 2, 2);
        ctx.fillRect(this.x + this.width - 3, this.y + 1, 2, this.height - 1);
        ctx.fillRect(this.x + 1, this.y + 1, 2, this.height - 1);
        break;

      case exports.UIFieldObject.STYLE_NSW:
        ctx.fillRect(this.x + 1, this.y + 1, this.width - 1, 2);
        ctx.fillRect(this.x + 1, this.y + this.height - 3, this.width - 1, 2);
        ctx.fillRect(this.x + 1, this.y + 1, 2, this.height - 2);
        break;

      case exports.UIFieldObject.STYLE_NES:
        ctx.fillRect(this.x, this.y + 1, this.width - 1, 2);
        ctx.fillRect(this.x + this.width - 3, this.y + 1, 2, this.height - 2);
        ctx.fillRect(this.x, this.y + this.height - 3, this.width - 1, 2);
        break;
    }

    ctx.fillStyle = "black";
    ctx.font = this.fsize + "pt " + cwt.GAME_FONT;

    if (this.text) {
      if (typeof this.text === "string") {
        var tw = ctx.measureText(this.text);
        ctx.fillText(
          this.text,
          this.x + (this.width / 2) - (tw.width / 2),
          this.y + (this.height / 2) + this.fsize / 2);
      } else {
        for (var i = 0, e = this.text.length; i < e; i++) {
          var tw = ctx.measureText(this.text[i]);
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
exports.UICustomFieldObject = my.Class(null, exports.UIFieldObject, {

  constructor: function(x, y, w, h, key, drawFn) {
    exports.UIFieldObject.call(this, x, y, w, h, key, 0, exports.UIFieldObject.STYLE_NORMAL);
    this.text = "";
    this.draw = drawFn;
  }
});

//
// @class
//
exports.UIButtonGroupObject = my.Class({

  constructor: function() {
    this.elements = [];
    this.selected = -1;
  },

  //
  //
  // @param {cwt.UIField} el
  //
  addElement: function(el) {
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
  activeButton: function() {
    return this.elements[this.selected];
  },

  //
  // Returns a button by it's key.
  //
  // @param {String} key
  // @return {cwt.UIField}
  //
  getButtonByKey: function(key) {
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
  getButtonsByReg: function(reg) {
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
  updateIndex: function(x, y) {
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
  handleInput: function(input) {
    if (cwt.DEBUG) cwt.assert(input !== null);

    if (typeof input !== "number") {
      input = input.key;
    }

    var res = true;
    this.elements[this.selected].inFocus = false;

    switch (input) {
      case cwt.Input.TYPE_UP:
      case cwt.Input.TYPE_LEFT:
        do {
          this.selected--;
          if (this.selected < 0) {
            this.selected = this.elements.length - 1;
          }
        } while (!this.elements[this.selected].action || this.elements[this.selected].inactive);
        break;

      case cwt.Input.TYPE_RIGHT:
      case cwt.Input.TYPE_DOWN:
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
  draw: function(ctx) {
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
exports.UICheckboxFieldObject = my.Class(null, exports.UIFieldObject, {

  constructor: function(x, y, w, h, text, fsize, style) {
    cwt.UIField.call(this, x, y, w, h, text, fsize, style, function(button, state) {
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
  draw: function(ctx) {
    cwt.UIField.prototype.draw.call(this, ctx);

    ctx.fillStyle = "black";
    ctx.fillRect(this.x + 4, this.y + 4, this.width - 8, this.height - 8);

    ctx.fillStyle = (this.checked) ? "rgb(60,60,60)" : "white";
    ctx.fillRect(this.x + 5, this.y + 5, this.width - 10, this.height - 10);
  }
});

exports.LoadingBarObject = my.Class({

  constructor: function(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.process = 0;
  },

  draw: function(ctx) {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, (parseInt(this.width * (this.process / 100), 10)), this.height);
  },

  setPercentage: function(p) {
    if (cwt.DEBUG) {
      cwt.assert(p >= 0 && p <= 100);
    }

    this.process = p;
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
exports.UIScreenLayoutObject = my.Class(null, exports.UIButtonGroupObject, {

  constructor: function(slotsX, slotsY, startX, startY) {
    exports.UIButtonGroupObject.call(this);

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
  repeat: function(n, f) {
    for (var i = 0; i < n; i++) {
      f.call(this, i);
    }
    return this;
  },

  //
  //
  // @param tiles
  //
  addRowGap: function(tiles) {
    this.curY += cwt.TILE_BASE * tiles;
    return this;
  },

  //
  //
  // @param tiles
  //
  addColGap: function(tiles) {
    this.curX += cwt.TILE_BASE * tiles;
    return this;
  },

  //
  // Breaks the current line
  //
  breakLine: function() {
    this.curX = this.left;
    this.curY += this.curH * cwt.TILE_BASE;
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
  addButton: function(tilesX, tilesY, offsetY, key, style, fSize, action) {
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

    var btn = new cwt.UIFieldObject(
      this.curX,
      this.curY + (offsetY * cwt.TILE_BASE),
      tilesX * cwt.TILE_BASE,
      tilesY * cwt.TILE_BASE,
      key,
      fSize,
      style,
      action
    );

    this.curX += tilesX * cwt.TILE_BASE;

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
  addCustomField: function(tilesX, tilesY, offsetY, key, draw, ignoreHeight) {
    if (ignoreHeight != true && this.curH < tilesY) {
      this.curH = tilesY;
    }

    var btn = new cwt.UICustomFieldObject(
      this.curX,
      this.curY + (offsetY * cwt.TILE_BASE),
      tilesX * cwt.TILE_BASE,
      tilesY * cwt.TILE_BASE,
      key,
      draw
    );

    this.curX += tilesX * cwt.TILE_BASE;

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
  addCheckbox: function(tilesX, tilesY, offsetY, key, style, fSize) {
    if (arguments.length === 5) {
      fSize = 12;
    } else if (arguments.length === 6 && typeof fSize === "function") {
      fSize = 12;
    }

    if (this.curH < tilesY) {
      this.curH = tilesY;
    }

    var btn = new cwt.UICheckboxFieldObject(
      this.curX,
      this.curY + (offsetY * cwt.TILE_BASE),
      tilesX * cwt.TILE_BASE,
      tilesY * cwt.TILE_BASE,
      key,
      fSize,
      style
    );

    this.curX += tilesX * cwt.TILE_BASE;

    this.addElement(btn);

    return this;
  }
});

//
// @class
// @extends {cwt.UIButtonGroup}
//
exports.UIPositionableButtonGroupObject = my.Class(null, exports.UIButtonGroupObject, {

  constructor: function() {
    exports.UIButtonGroupObject.call(this);
    this.x = 0;
    this.y = 0;
  },

  setMenuPosition: function(x, y) {
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

//
//
// @class
//
exports.TileVariantInfoObject = my.Class({

  constructor: function(desc, connection) {
    this.desc = desc;
    this.connection = connection;
  },

  //
  //
  // @param type
  // @return {string}
  //
  grabShortKey: function(type) {
    if (type && this.desc[type]) return this.desc[type];
    else return "";
  },

  //
  // Returns the variant number in relation to a given set of neighbour types.
  //
  // @param {string} typeN
  // @param {string} typeE
  // @param {string} typeS
  // @param {string} typeW
  // @param {string?} typeNE
  // @param {string?} typeSE
  // @param {string?} typeSW
  // @param {string?} typeNW
  //
  getVariant: function(typeN, typeE, typeS, typeW, typeNE, typeSE, typeSW, typeNW) {

    // grab shorts
    typeN = this.grabShortKey(typeN);
    typeNE = this.grabShortKey(typeNE);
    typeE = this.grabShortKey(typeE);
    typeSE = this.grabShortKey(typeSE);
    typeS = this.grabShortKey(typeS);
    typeSW = this.grabShortKey(typeSW);
    typeW = this.grabShortKey(typeW);
    typeNW = this.grabShortKey(typeNW);

    // search variant
    for (var i = 0, e = this.connection.length; i < e; i++) {
      var cConn = this.connection[i];
      if (cConn.length === 5) {

        // check_ plus
        if (cConn[1] !== "" && cConn[1] !== typeN) continue;
        if (cConn[2] !== "" && cConn[2] !== typeE) continue;
        if (cConn[3] !== "" && cConn[3] !== typeS) continue;
        if (cConn[4] !== "" && cConn[4] !== typeW) continue;

      } else {

        // check_ cross
        if (cConn[1] !== "" && cConn[1] !== typeN) continue;
        if (cConn[2] !== "" && cConn[2] !== typeNE) continue;
        if (cConn[3] !== "" && cConn[3] !== typeE) continue;
        if (cConn[4] !== "" && cConn[4] !== typeSE) continue;
        if (cConn[5] !== "" && cConn[5] !== typeS) continue;
        if (cConn[6] !== "" && cConn[6] !== typeSW) continue;
        if (cConn[7] !== "" && cConn[7] !== typeW) continue;
        if (cConn[8] !== "" && cConn[8] !== typeNW) continue;
      }

      return cConn[0];
    }
  }
});
