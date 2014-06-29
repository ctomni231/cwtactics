"use strict";

// **Class Sprite**
//
cwt.Sprite = my.Class({

  STATIC: {

    // **Const**
    // 
    MINIMAP_2x2: 0,

    // **Const**
    // 
    MINIMAP_4x4: 1,

    // ---------------------------------------------

    // **Const**
    // 
    UNIT_STATES: 30,

    // **Const**
    //
    UNIT_RED: 0,

    // **Const**
    //
    UNIT_BLUE: 6,

    // **Const**
    //
    UNIT_GREEN: 12,

    // **Const**
    //
    UNIT_YELLOW: 18,

    // **Const**
    //
    UNIT_SHADOW_MASK: 24,

    // **Const**
    //
    UNIT_STATE_IDLE: 0,

    // **Const**
    //
    UNIT_STATE_IDLE_INVERTED: 1,

    // **Const**
    //
    UNIT_STATE_LEFT: 2,

    // **Const**
    //
    UNIT_STATE_RIGHT: 3,

    // **Const**
    //
    UNIT_STATE_UP: 4,

    // **Const**
    //
    UNIT_STATE_DOWN: 5,

    // ---------------------------------------------

    // **Const**
    //
    TILE_STATES: 2,

    // **Const**
    //
    TILE_SHADOW: 1,

    // ---------------------------------------------

    // **Const**
    //
    PROPERTY_STATES: 6,

    // **Const**
    //
    PROPERTY_RED: 0,

    // **Const**
    //
    PROPERTY_BLUE: 1,

    // **Const**
    //
    PROPERTY_GREEN: 2,

    // **Const**
    //
    PROPERTY_YELLOW: 3,

    // **Const**
    //
    PROPERTY_NEUTRAL: 4,

    // **Const**
    //
    PROPERTY_SHADOW_MASK: 5,

    // ---------------------------------------------

    // **Const**
    //
    SYMBOL_HP: 0,

    // **Const**
    //
    SYMBOL_AMMO: 1,

    // **Const**
    //
    SYMBOL_FUEL: 2,

    // **Const**
    //
    SYMBOL_LOAD: 3,

    // **Const**
    //
    SYMBOL_CAPTURE: 4,

    // **Const**
    //
    SYMBOL_ATT: 5,

    // **Const**
    //
    SYMBOL_VISION: 6,

    // **Const**
    //
    SYMBOL_MOVE: 7,

    // **Const**
    //
    SYMBOL_UNKNOWN: 8,

    // **Const**
    //
    SYMBOL_HIDDEN: 9,

    // **Const**
    //
    SYMBOL_DEFENSE: 10,

    // **Const**
    //
    SYMBOL_RANK_1: 11,

    // **Const**
    //
    SYMBOL_RANK_2: 12,

    // **Const**
    //
    SYMBOL_RANK_3: 13,

    // ---------------------------------------------

    // **Const**
    //
    DIRECTION_N: 0,

    // **Const**
    //
    DIRECTION_S: 1,

    // **Const**
    //
    DIRECTION_W: 2,

    // **Const**
    //
    DIRECTION_E: 3,

    // **Const**
    //
    DIRECTION_SW: 4,

    // **Const**
    //
    DIRECTION_SE: 5,

    // **Const**
    //
    DIRECTION_NW: 6,

    // **Const**
    //
    DIRECTION_NE: 7,

    // **Const**
    DIRECTION_NS: 8,

    // **Const**
    //
    DIRECTION_WE: 9,

    // **Const**
    //
    DIRECTION_ALL: 8,

    // **Const**
    //
    DIRECTION_UP: 0,

    // **Const**
    //
    DIRECTION_DOWN: 1,

    // **Const**
    //
    DIRECTION_LEFT: 2,

    // **Const**
    //
    DIRECTION_RIGHT: 3,

    // ---------------------------------------------

    // **Const**
    //
    FOCUS_MOVE: 0,

    // **Const**
    //
    FOCUS_ATTACK: 1,

    // ---------------------------------------------

    // **Const**
    //
    COLOR_MAP_PROPERTY: 0,

    // **Const**
    //
    COLOR_MAP_UNIT: 1,

    // ---------------------------------------------

    // **Const**
    //
    EXPLOSION_GROUND: 0,

    // **Const**
    //
    EXPLOSION_AIR: 1,

    // **Const**
    //
    EXPLOSION_DUST: 2,

    // **Const**
    //
    EXPLOSION_SEA: 3,

    // ---------------------------------------------

    /**
     *
     * @param {cwt.Sprite} sprite
     * @return {string}
     */
    toJSON: function (sprite) {
      if (cwt.DEBUG) cwt.assert(sprite instanceof cwt.Sprite);

      var data = [];
      for (var i = 0, e = sprite.images.length; i < e; i++) {
        data[i] = Base64Helper.canvasToBase64(sprite.images[i]);
      }

      return JSON.stringify(data);
    },

    /**
     * Loads a sprite from the cache.
     *
     * @param spriteData
     * @return {cwt.Sprite}
     */
    fromJSON: function (spriteData) {
      if (typeof spriteData === "string") {
        spriteData = JSON.parse(spriteData);
      }

      var sprite = new cwt.Sprite(spriteData.length);
      var data = sprite.images;
      for (var i = 0, e = spriteData.length; i < e; i++) {
        data[i] = Base64Helper.base64ToImage(spriteData[i]);
      }

      return sprite;
    }
  },

  constructor: function (numOfImages) {
    this.images = [];

    while (numOfImages > 0) {
      this.images.push(null);
      numOfImages--;
    }
  },

  // **Sprite.getNumberOfImages(): int**
  //
  getNumberOfImages: function () {
    return this.images.length;
  },

  // **Sprite.setImage(int, HTMLCanvas|Image)**
  //
  setImage: function (index, image) {
    if (cwt.DEBUG) cwt.assert(index >= 0 && index < this.images.length);
    this.images[index] = image;
  },

  // **Sprite.getImage(int): HTMLCanvas|Image**
  //
  getImage: function (index) {
    return this.images[index];
  }
});

// **Class TileVariantInfo**
//
cwt.TileVariantInfo = my.Class({

  constructor: function (desc, connection) {
    this.desc = desc;
    this.connection = connection;
  },

  // **TileVariantInfo.grabShortKey(string): string**
  //
  grabShortKey: function (type) {
    if (type && this.desc[type]) return this.desc[type];
    else return "";
  },

  // **TileVariantInfo.getVariant(string, string, string, string, string?, string?, string?, string?): int**
  //
  // Returns the variant number in relation to a given set of neighbour types.
  //
  getVariant: function (typeN, typeE, typeS, typeW, typeNE, typeSE, typeSW, typeNW) {

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

// **Class UIField**
//
cwt.UIField = my.Class({

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
    this.text = (text) ? cwt.Localization.forKey(text) : text;
    if (this.text.search(/\n/) !== -1) {
      this.text = this.text.split("\n");
    }
  },

  /**
   *
   * @param x
   * @param y
   * @return {boolean}
   */
  positionInButton: function (x, y) {
    return (x >= this.x && x < this.x + this.width && y >= this.y && y < this.y + this.height);
  },

  erase: function (ctx) {
    ctx.clearRect(this.x, this.y, this.width, this.height);
  },

  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  draw: function (ctx) {
    if (this.style === cwt.UIField.STYLE_NONE) {
      return;
    }

    ctx.fillStyle = (this.inFocus) ? "rgb(220,220,220)" : "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // draw borders
    ctx.fillStyle = "rgb(60,60,60)";
    switch (this.style) {

      case cwt.UIField.STYLE_NORMAL :
        ctx.fillRect(this.x + 1, this.y + 1, this.width - 2, this.height - 2);
        ctx.fillStyle = (this.inFocus) ? "rgb(220,220,220)" : "white";
        ctx.fillRect(this.x + 3, this.y + 3, this.width - 6, this.height - 6);
        break;

      case cwt.UIField.STYLE_N :
        ctx.fillRect(this.x, this.y + 1, this.width, 2);
        break;

      case cwt.UIField.STYLE_E :
        ctx.fillRect(this.x + this.width - 3, this.y, 2, this.height);
        break;

      case cwt.UIField.STYLE_S :
        ctx.fillRect(this.x, this.y + this.height - 3, this.width, 2);
        break;

      case cwt.UIField.STYLE_W :
        ctx.fillRect(this.x + 1, this.y, 2, this.height);
        break;

      case cwt.UIField.STYLE_NE :
        ctx.fillRect(this.x, this.y + 1, this.width - 1, 2);
        ctx.fillRect(this.x + this.width - 3, this.y + 1, 2, this.height - 1);
        break;

      case cwt.UIField.STYLE_NW :
        ctx.fillRect(this.x + 1, this.y + 1, this.width, 2);
        ctx.fillRect(this.x + 1, this.y + 1, 2, this.height - 1);
        break;

      case cwt.UIField.STYLE_ES :
        ctx.fillRect(this.x + this.width - 3, this.y, 2, this.height - 1);
        ctx.fillRect(this.x, this.y + this.height - 3, this.width - 1, 2);
        break;

      case cwt.UIField.STYLE_SW :
        ctx.fillRect(this.x + 1, this.y + this.height - 3, this.width - 1, 2);
        ctx.fillRect(this.x + 1, this.y, 2, this.height - 1);
        break;

      case cwt.UIField.STYLE_EW :
        ctx.fillRect(this.x + this.width - 3, this.y, 2, this.height);
        ctx.fillRect(this.x + 1, this.y, 2, this.height);
        break;

      case cwt.UIField.STYLE_NS :
        ctx.fillRect(this.x, this.y + 1, this.width, 2);
        ctx.fillRect(this.x, this.y + this.height - 3, this.width, 2);
        break;

      case cwt.UIField.STYLE_ESW :
        ctx.fillRect(this.x + this.width - 3, this.y, 2, this.height - 1);
        ctx.fillRect(this.x + 1, this.y + this.height - 3, this.width - 2, 2);
        ctx.fillRect(this.x + 1, this.y, 2, this.height - 1);
        break;

      case cwt.UIField.STYLE_NEW :
        ctx.fillRect(this.x + 1, this.y + 1, this.width - 2, 2);
        ctx.fillRect(this.x + this.width - 3, this.y + 1, 2, this.height - 1);
        ctx.fillRect(this.x + 1, this.y + 1, 2, this.height - 1);
        break;

      case cwt.UIField.STYLE_NSW :
        ctx.fillRect(this.x + 1, this.y + 1, this.width - 1, 2);
        ctx.fillRect(this.x + 1, this.y + this.height - 3, this.width - 1, 2);
        ctx.fillRect(this.x + 1, this.y + 1, 2, this.height - 2);
        break;

      case cwt.UIField.STYLE_NES :
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

/**
 * @class
 */
cwt.UIButtonGroup = my.Class(/** @lends cwt.UIButtonGroup.prototype */ {

  constructor: function () {
    this.elements = [];
    this.selected = -1;
  },

  /**
   *
   * @param {cwt.UIField} el
   */
  addElement: function (el) {
    this.elements.push(el);
    if (this.selected === -1 && el.action) {
      this.elements[this.elements.length - 1].inFocus = true;
      this.selected = this.elements.length - 1;
    }
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

  /**
   *
   * @param input
   * @return {boolean} true, if the index was updated, else false
   */
  handleInput: function (input) {
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
      var el = this.elements[i];

      if (!el.inactive) {
        el.draw(ctx);
      }
    }
  }
});

/**
 *
 * @class
 * @extends {cwt.UIField}
 */
cwt.UICheckboxField = my.Class(null, cwt.UIField, /** @lends cwt.UICheckboxField.prototype */ {

  constructor: function (x, y, w, h, text, fsize, style) {
    cwt.UIField.call(this, x, y, w, h, text, fsize, style, function (button, state) {
      state.rendered = false;
      button.checked = !button.checked;
    });
    this.text = "";
    this.checked = false;
  },

  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  draw: function (ctx) {
    cwt.UIField.prototype.draw.call(this, ctx);

    ctx.fillStyle = "black";
    ctx.fillRect(this.x + 4, this.y + 4, this.width - 8, this.height - 8);

    ctx.fillStyle = (this.checked) ? "rgb(60,60,60)" : "white";
    ctx.fillRect(this.x + 5, this.y + 5, this.width - 10, this.height - 10);
  }
});

/**
 *
 * @class
 * @extends {cwt.UIField}
 */
cwt.UICustomField = my.Class(null, cwt.UIField, /** @lends cwt.UIField.prototype */ {

  constructor: function (x, y, w, h, key, drawFn) {
    cwt.UIField.call(this, x, y, w, h, key, 0, cwt.UIField.STYLE_NORMAL);
    this.text = "";
    this.draw = drawFn;
  }
});

cwt.UILoadingBar = my.Class({

  constructor: function (x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.process = 0;
  },

  draw: function (ctx) {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, (parseInt(this.width * (this.process / 100), 10)), this.height);
  },

  setPercentage: function (p) {
    if (cwt.DEBUG) {
      cwt.assert(p >= 0 && p <= 100);
    }

    this.process = p;
  }
});

/**
 * @class
 * @extends {cwt.UIButtonGroup}
 */
cwt.UIPositionableButtonGroup = my.Class(null, cwt.UIButtonGroup, /** @lends cwt.UIPositionableButtonGroup.prototype */ {

  constructor: function () {
    cwt.UIButtonGroup.call(this);
    this.x = 0;
    this.y = 0;
  },

  setMenuPosition: function (x, y) {
    var diffX = x - this.x;
    var diffY = y - this.y;

    for (var i = 0, e = this.elements.length; i < e; i++) {
      var element = /** @type {cwt.UIField} */ this.elements[i];

      element.x += diffX;
      element.y += diffY;
    }

    this.x = x;
    this.y = y;
  }
});

/**
 * A screen layout is a group out of ui elements. This elements can be interactive or non-interactive. It should
 * be used to create and define a screen layout. Furthermore the screen layout offers API to interact with the
 * components.
 *
 * @class
 * @extends {cwt.UIButtonGroup}
 */
cwt.UIScreenLayout = my.Class(null, cwt.UIButtonGroup, /** @lends cwt.UIScreenLayout.prototype */ {

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
  repeat: function (n, f) {
    for (var i = 0; i < n; i++) {
      f.call(this, i);
    }
    return this;
  },

  /**
   *
   * @param tiles
   */
  addRowGap: function (tiles) {
    this.curY += cwt.TILE_BASE * tiles;
    return this;
  },

  /**
   *
   * @param tiles
   */
  addColGap: function (tiles) {
    this.curX += cwt.TILE_BASE * tiles;
    return this;
  },

  /**
   * Breaks the current line
   */
  breakLine: function () {
    this.curX = this.left;
    this.curY += this.curH * cwt.TILE_BASE;
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

cwt.MapRenderer = {

  // **eraseCursor()**
  //
  // Renders the cursor to the UI layer.
  //
  eraseCursor: function () {
    var ctx = cwt.Screen.layerUI.getContext();
    var x = (cwt.Cursor.x - cwt.Screen.offsetX) * cwt.TILE_BASE;
    var y = (cwt.Cursor.y - cwt.Screen.offsetY) * cwt.TILE_BASE;

    // clear cursor at old position
    ctx.clearRect(
      x - cwt.TILE_BASE,
      y - cwt.TILE_BASE,
      cwt.TILE_BASE * 3,
      cwt.TILE_BASE * 3
    );
  }
};


/**
 * Renders the cursor to the UI layer.
 */
cwt.MapRenderer.renderCursor = function () {
  var ctx = cwt.Screen.layerUI.getContext();
  var cursorImg = cwt.Image.sprites.CURSOR.getImage(0);
  var h = cwt.TILE_BASE / 2;
  var x = (cwt.Cursor.x - cwt.Screen.offsetX) * cwt.TILE_BASE;
  var y = (cwt.Cursor.y - cwt.Screen.offsetY) * cwt.TILE_BASE;

  // render cursor at new position
  ctx.drawImage(cursorImg, x - h, y - h);
  ctx.drawImage(cursorImg, x + h + h, y + h + h);
  ctx.drawImage(cursorImg, x + h + h, y - h);
  ctx.drawImage(cursorImg, x - h, y + h + h);
};

// **unitAnimationHalfStep_ (private)**
//
cwt.MapRenderer.unitAnimationHalfStep_ = false;

// **curTime_ (private)**
//
cwt.MapRenderer.curTime_ = 0;

// **indexUnitAnimation (readOnly)**
//
cwt.MapRenderer.indexUnitAnimation = 0;

// **indexMapAnimation (readOnly)**
//
cwt.MapRenderer.indexMapAnimation = 0;

// **indexFocus (readOnly)**
//
cwt.MapRenderer.indexFocus = 0;

// **indexFocusTime (readOnly)**
//
cwt.MapRenderer.indexFocusTime = 0;

/**
 *
 * @param {number} delta
 */
cwt.MapRenderer.evaluateCycle = function (delta, focusActive) {
  var index;

  if (focusActive) {
    this.indexFocusTime += delta;

    if (this.indexFocusTime >= 120) {
      this.indexFocusTime = 0;

      this.indexFocus++;
      if (this.indexFocus >= 7) {
        this.indexFocus = 0;
      }

      cwt.Screen.layerFocus.renderLayer(this.indexFocus);
    }
  }

  this.curTime_ += delta;
  if (this.curTime_ > 150) {
    this.curTime_ = 0;

    // calc unit animation layer step
    this.unitAnimationHalfStep_ = !this.unitAnimationHalfStep_;
    if (!this.unitAnimationHalfStep_) {

      index = this.indexUnitAnimation + 1;
      if (index === 3) {
        index = 0;
      }

      // render unit animation layer
      cwt.Screen.layerUnit.renderLayer(index);
      this.indexUnitAnimation = index;
    }

    // map animation layer
    index = this.indexMapAnimation + 1;
    if (index === 8) {
      index = 0;
    }

    // render map animation layer
    cwt.Screen.layerMap.renderLayer(index);
    this.indexMapAnimation = index;
  }
};
cwt.MapRenderer.renderFocusOnScreen = function (selection) {
  var x = cwt.Screen.offsetX;
  var y = cwt.Screen.offsetY;
  var w = (cwt.Map.width < cwt.SCREEN_WIDTH) ? cwt.Map.width : cwt.SCREEN_WIDTH;
  var h = (cwt.Map.height < cwt.SCREEN_HEIGHT) ? cwt.Map.height : cwt.SCREEN_HEIGHT;

  this.renderFocus(x, y, w, h, selection);
};

cwt.MapRenderer.renderFocus = function (ox, oy, w, h, selection) {
  var sprite = cwt.Image.sprites.FOCUS.getImage(0);

  var n = 0;
  while (n < 7) {
    var effects = cwt.Screen.layerFocus;

    effects.clear(n);
    var ctx = effects.getContext(n);

    ctx.globalAlpha = 0.6;

    var x = ox;
    for (var xe = x + w; x < xe; x++) {
      var y = oy;
      for (var ye = y + h; y < ye; y++) {

        if (selection.getValue(x, y) >= 0) {

          var scx = cwt.TILE_BASE * n;
          var scy = 0;
          var scw = cwt.TILE_BASE;
          var sch = cwt.TILE_BASE;
          var tcx = (x - cwt.Screen.offsetX) * cwt.TILE_BASE;
          var tcy = (y - cwt.Screen.offsetY) * cwt.TILE_BASE;
          var tcw = cwt.TILE_BASE;
          var tch = cwt.TILE_BASE;

          ctx.drawImage(
            sprite,
            scx, scy,
            scw, sch,
            tcx, tcy,
            tcw, tch
          );
        }
      }
    }

    ctx.globalAlpha = 1;

    n++;
  }
};

cwt.MapRenderer.shiftFocus = function (code) {
  cwt.MapRenderer.shiftLayer(code, cwt.Screen.layerFocus, 7, false);
};
/**
 *
 * @namespace
 */

cwt.MapRenderer.shiftLayer = function (code, layer, steps, selfDraw) {
  var tmpCanvas = this.getTempCanvas();
  var tmpContext = tmpCanvas.getContext("2d");

  // calculate meta data for shift
  var sx = 0;
  var sy = 0;
  var scx = 0;
  var scy = 0;
  var w = layer.w;
  var h = layer.h;
  switch (code) {
    case cwt.Move.MOVE_CODES_LEFT:
      scx += cwt.TILE_BASE;
      w -= cwt.TILE_BASE;
      break;

    case cwt.Move.MOVE_CODES_RIGHT:
      sx += cwt.TILE_BASE;
      w -= cwt.TILE_BASE;
      break;

    case cwt.Move.MOVE_CODES_UP:
      scy += cwt.TILE_BASE;
      h -= cwt.TILE_BASE;
      break;

    case cwt.Move.MOVE_CODES_DOWN:
      sy += cwt.TILE_BASE;
      h -= cwt.TILE_BASE;
      break;
  }

  // update background layers
  var n = 0;
  while (n < steps) {

    if (selfDraw === true) {
      layer.getContext(n).drawImage(
        layer.getLayer(n),
        scx, scy,
        w, h,
        sx, sy,
        w, h
      );

    } else {
      tmpContext.clearRect(0, 0, layer.w, layer.h);

      // copy visible content to temp canvas
      tmpContext.drawImage(
        layer.getLayer(n),
        scx, scy,
        w, h,
        sx, sy,
        w, h
      )

      // clear original canvas
      layer.clear(n);

      // copy visible content back to the original canvas
      layer.getContext(n).drawImage(tmpCanvas, 0, 0);

    }

    n++;
  }
};
/**
 *
 * NOTE: clears the area before update
 *
 * @param x
 * @param y
 * @param range
 */
cwt.MapRenderer.renderFogCircle = function (x, y, range) {
  this.renderFogRect(x, y, range, range, true);
};

/**
 *
 * NOTE: clears the area before update
 *
 * @param x
 * @param y
 * @param w
 * @param h
 * @param {boolean?} circle
 */
cwt.MapRenderer.renderFogRect = function (x, y, w, h, circle) {
  if (arguments.length === 4) circle = false;
  var data = cwt.Map.data;
  var layer = cwt.Screen.layerFog.getContext(0);
  var cx, cy, range;

  if (circle) {

    // prepare meta data for the circle center and the pseudo-circle search field
    cx = x;
    cy = y;
    x -= w;
    y -= h;
    range = w;
    w += w;
    h += w;

  } else {

    // clear area in background layer as rectangle only in rectangle mode
    layer.clearRect(
      (x - cwt.Screen.offsetX) * cwt.TILE_BASE,
      (y - cwt.Screen.offsetY) * cwt.TILE_BASE,
      w * cwt.TILE_BASE,
      h * cwt.TILE_BASE
    );
  }

  // render
  var oy = y;
  for (var xe = x + w; x < xe; x++) {
    y = oy;
    for (var ye = y + h; y < ye; y++) {
      var distance;

      if (circle) {
        distance = cwt.Map.getDistance(x, y, cx, cy);
        if (!cwt.Map.isValidPosition(x, y) || distance) {
          continue;
        }

        // clear position
        layer.clearRect(
          (x - cwt.Screen.offsetX) * cwt.TILE_BASE,
          (y - cwt.Screen.offsetY) * cwt.TILE_BASE,
          cwt.TILE_BASE,
          cwt.TILE_BASE
        );
      }

      var tile = data[x][y];
      if (tile.visionClient === 0) {

        var sprite = null;
        if (tile.property) {
          sprite = cwt.Image.sprites[tile.property.type.ID].getImage(
            cwt.Sprite.PROPERTY_SHADOW_MASK
          );
        } else {
          sprite = cwt.Image.sprites[tile.type.ID].getImage(
            tile.variant * cwt.Sprite.TILE_STATES + cwt.Sprite.TILE_SHADOW
          );
        }

        var scx = (cwt.Image.longAnimatedTiles[tile.type.ID]) ? cwt.TILE_BASE * n : 0;
        var scy = 0;
        var scw = cwt.TILE_BASE;
        var sch = cwt.TILE_BASE * 2;
        var tcx = (x - cwt.Screen.offsetX) * cwt.TILE_BASE;
        var tcy = (y - cwt.Screen.offsetY) * cwt.TILE_BASE - cwt.TILE_BASE;
        var tcw = cwt.TILE_BASE;
        var tch = cwt.TILE_BASE * 2;

        if (tcy < 0) {
          scy = scy + cwt.TILE_BASE;
          sch = sch - cwt.TILE_BASE;
          tcy = tcy + cwt.TILE_BASE;
          tch = tch - cwt.TILE_BASE;
        }

        layer.drawImage(
          sprite,
          scx, scy,
          scw, sch,
          tcx, tcy,
          tcw, tch
        );
      } else {

        // fix overlays on all tiles that are at the max range in the circle mode
        if (circle) {
          if (distance === range) {

            // top check
            if (y <= cy) {
              this.fixOverlayFog_(x, y, true);
            }

            // bottom check
            if (y >= cy) {
              this.fixOverlayFog_(x, y, false);
            }
          }
        }
      }
    }
  }

  // fix overlay top and bottom in the rectangle mode
  if (!circle) {

  }

  this.renderFogBackgroundLayer();
};

cwt.MapRenderer.fixOverlayFog_ = function (x, y, isTop) {
  if (isTop) {

  } else {

  }
};

/**
 *
 */
cwt.MapRenderer.renderFogBackgroundLayer = function () {
  cwt.Screen.layerFog.getContext().globalAlpha = 0.35;
  cwt.Screen.layerFog.renderLayer(0);
  cwt.Screen.layerFog.getContext().globalAlpha = 1;
};

/**
 *
 * Note: this one clears the layer before action
 *
 * @param {number} code
 */
cwt.MapRenderer.shiftFog = function (code) {
  cwt.MapRenderer.shiftLayer(code, cwt.Screen.layerFog, 1, false);
  this.renderFogBackgroundLayer();
};
/**
 *
 * @param {number} x
 * @param {number} y
 */
cwt.MapRenderer.renderTile = function (x, y) {
  this.renderTiles(x, y, 1, 1, false);

  // draw overlay of the bottom tile
  if (y < cwt.Map.height - 1) {
    this.renderTiles(x, y + 1, 1, 1, true);
  }
};

cwt.MapRenderer.renderTileOverlayRow = function () {
  cwt.MapRenderer.renderTiles(
    cwt.Screen.offsetX,
    cwt.Screen.offsetY + 1,
    (cwt.Map.width < cwt.SCREEN_WIDTH) ? cwt.Map.width : cwt.SCREEN_WIDTH,
    1,
    true
  );
};

cwt.MapRenderer.renderTiles = function (x, oy, w, h, overlayDraw) {
  if (arguments.length === 4) overlayDraw = false;
  var mapData = cwt.Map.data;
  var mapLayer = cwt.Screen.layerMap;
  var ctx;
  var scx;
  var scy;
  var scw;
  var sch;
  var tcx;
  var tcy;
  var tcw;
  var tch;
  var tile;
  var sprite, propSprite;
  var state;

  for (var xe = x + w; x < xe; x++) {
    for (var y = oy, ye = y + h; y < ye; y++) {
      tile = mapData[x][y];
      sprite = cwt.Image.sprites[tile.type.ID].getImage(tile.variant * cwt.Sprite.TILE_STATES);

      // grab property status before loop (calc it one instead of eight times)
      if (tile.property) {
        if (tile.property.owner) {
          switch (tile.property.owner.id) {
            case 0:
              state = cwt.Sprite.PROPERTY_RED;
              break;

            case 1:
              state = cwt.Sprite.PROPERTY_BLUE;
              break;

            case 2:
              state = cwt.Sprite.PROPERTY_GREEN;
              break;

            case 3:
              state = cwt.Sprite.PROPERTY_YELLOW;
              break;
          }
        } else {
          state = cwt.Sprite.PROPERTY_NEUTRAL;
        }

        propSprite = cwt.Image.sprites[tile.property.type.ID].getImage(state);
      }

      // render all phases
      var n = 0;
      while (n < 8) {
        ctx = mapLayer.getContext(n);

        scx = (cwt.Image.longAnimatedTiles[tile.type.ID]) ? cwt.TILE_BASE * n : 0;
        scy = 0;
        scw = cwt.TILE_BASE;
        sch = cwt.TILE_BASE * 2;
        tcx = (x - cwt.Screen.offsetX) * cwt.TILE_BASE;
        tcy = (y - cwt.Screen.offsetY) * cwt.TILE_BASE - cwt.TILE_BASE;
        tcw = cwt.TILE_BASE;
        tch = cwt.TILE_BASE * 2;

        if (tcy < 0) {
          scy = scy + cwt.TILE_BASE;
          sch = sch - cwt.TILE_BASE;
          tcy = tcy + cwt.TILE_BASE;
          tch = tch - cwt.TILE_BASE;
        }

        if (overlayDraw) {
          sch = sch - cwt.TILE_BASE;
          tch = tch - cwt.TILE_BASE;
        }

        // render tile
        ctx.drawImage(
          sprite,
          scx, scy,
          scw, sch,
          tcx, tcy,
          tcw, tch
        );

        // render property
        if (tile.property) {
          scx = cwt.TILE_BASE * (parseInt(n / 2, 10));

          ctx.drawImage(
            propSprite,
            scx, scy,
            scw, sch,
            tcx, tcy,
            tcw, tch
          );
        }

        n++;
      }
    }
  }
};

/**
 *
 * Note: this one does not clear the layer before action
 *
 * @param {number} code
 */
cwt.MapRenderer.shiftTiles = function (code) {
  cwt.MapRenderer.shiftLayer(code, cwt.Screen.layerMap, 8, true);
};
/**
 *
 * NOTE: does not clear the area before update
 *
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 */
cwt.MapRenderer.renderUnits = function (x, oy, w, h) {
  var mapData = cwt.Map.data;
  var layer = cwt.Screen.layerUnit;
  var halfTileBase = parseInt(cwt.TILE_BASE / 2, 10);

  for (var xe = x + w; x < xe; x++) {
    for (var y = oy, ye = y + h; y < ye; y++) {
      var tile = mapData[x][y];
      if (tile.visionClient === 0) continue;

      var unit = tile.unit;
      if (!unit) continue;

      var state;
      switch (unit.owner.id) {
        case 0:
          state = cwt.Sprite.UNIT_RED;
          break;

        case 1:
          state = cwt.Sprite.UNIT_BLUE;
          break;

        case 2:
          state = cwt.Sprite.UNIT_GREEN;
          break;

        case 3:
          state = cwt.Sprite.UNIT_YELLOW;
          break;
      }

      // inverted ?
      if (unit.owner.id % 2 === 0) {
        state += cwt.Sprite.UNIT_STATE_IDLE_INVERTED;
      }

      var sprite = cwt.Image.sprites[unit.type.ID].getImage(state);
      var n = 0;
      while (n < 3) {
        var ctx = layer.getContext(n);

        var scx = (cwt.TILE_BASE * 2) * n;
        var scy = 0;
        var scw = cwt.TILE_BASE * 2;
        var sch = cwt.TILE_BASE * 2;
        var tcx = (x - cwt.Screen.offsetX) * cwt.TILE_BASE - halfTileBase;
        var tcy = (y - cwt.Screen.offsetY) * cwt.TILE_BASE - halfTileBase;
        var tcw = cwt.TILE_BASE + cwt.TILE_BASE;
        var tch = cwt.TILE_BASE + cwt.TILE_BASE;

        ctx.drawImage(
          sprite,
          scx, scy,
          scw, sch,
          tcx, tcy,
          tcw, tch
        );

        n++;
      }

    }
  }
};

/**
 *
 * Note: this one clears the layer before action
 *
 * @param {number} code
 */
cwt.MapRenderer.shiftUnits = function (code) {
  cwt.MapRenderer.shiftLayer(code, cwt.Screen.layerUnit, 3, false);
};
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
      cwt.UIField.STYLE_NORMAL,

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
cwt.MapRenderer.prepareMenu = function (menu) {
  var gfxMenu = cwt.MapRenderer.layoutGenericMenu_;
  var select = menu.getSelectedIndex();
  var numElements = menu.getSize();

  gfxMenu.setMenuPosition(
    parseInt((cwt.Screen.width / 2) - cwt.MapRenderer.MENU_ENTRY_WIDTH / 2, 10),
    parseInt((cwt.Screen.height / 2) - ((numElements * cwt.MapRenderer.MENU_ENTRY_HEIGHT) / 2), 10)
  );

  for (var i = 0; i < cwt.MapRenderer.MENU_ELEMENTS_MAX; i++) {
    if (i < numElements) {
      gfxMenu.elements[i].inactive = false;
      gfxMenu.elements[i].text = cwt.Localization.forKey(menu.getContent(i));

      // set style
      gfxMenu.elements[i].style = (
        (numElements === 1 ? cwt.UIField.STYLE_NORMAL :
          (i === 0 ? cwt.UIField.STYLE_NEW :
            (i === numElements - 1 ? cwt.UIField.STYLE_ESW : cwt.UIField.STYLE_EW)))
        );

    } else {
      gfxMenu.elements[i].inactive = true;
    }
  }

  this.renderMenu(menu);
};

cwt.MapRenderer.renderMenu = function (menu) {
  cwt.MapRenderer.layoutGenericMenu_.draw(cwt.Screen.layerUI.getContext(0));
};
/**
 *
 */
cwt.MapRenderer.renderScreen = function () {
  var time;

  if (cwt.DEBUG) time = (new Date()).getTime();

  var x = cwt.Screen.offsetX;
  var y = cwt.Screen.offsetY;
  var w = (cwt.Map.width < cwt.SCREEN_WIDTH) ? cwt.Map.width : cwt.SCREEN_WIDTH;
  var h = (cwt.Map.height < cwt.SCREEN_HEIGHT) ? cwt.Map.height : cwt.SCREEN_HEIGHT;

  this.renderTiles(x, y, w, h);
  this.renderUnits(x, y, w, h);

  // directly update all layers
  cwt.Screen.layerMap.renderLayer(this.indexMapAnimation);
  cwt.Screen.layerUnit.renderLayer(this.indexUnitAnimation);

  this.renderFogRect(x, y, w, h);

  if (cwt.DEBUG) console.log("rendered the complete screen (" + ((new Date()).getTime() - time) + "ms)");
};

/**
 *
 * @param {number} code
 */
cwt.MapRenderer.shiftMap = function (code, selection) {
  var time;

  if (cwt.DEBUG) time = (new Date()).getTime();

  var fx = cwt.Screen.offsetX;
  var fy = cwt.Screen.offsetY;
  var fw = cwt.SCREEN_WIDTH;
  var fh = cwt.SCREEN_HEIGHT;

  // extract needed data for the shift process
  switch (code) {
    case cwt.Move.MOVE_CODES_LEFT:
      fx += cwt.SCREEN_WIDTH - 1;
      fw = 1;
      break;

    case cwt.Move.MOVE_CODES_RIGHT:
      fw = 1;
      break;

    case cwt.Move.MOVE_CODES_UP:
      fy += cwt.SCREEN_HEIGHT - 1;
      fh = 1;
      break;

    case cwt.Move.MOVE_CODES_DOWN:
      fh = 1;
      break;
  }

  // shift screen
  this.shiftTiles(code);
  this.shiftUnits(code);
  this.shiftFog(code);
  if (cwt.Gameflow.globalData.focusActive) this.shiftFocus(code);

  // fill created hole
  this.renderTiles(fx, fy, fw, fh);
  this.renderUnits(fx, fy, fw, fh);
  this.renderFogRect(fx, fy, fw, fh);
  if (cwt.Gameflow.globalData.focusActive) this.renderFocus(fx, fy, fw, fh, selection);

  // fix overlay when screen moves down
  if (code === cwt.Move.MOVE_CODES_DOWN) {
    this.renderTileOverlayRow();
  }

  // directly update all layers
  cwt.Screen.layerMap.renderLayer(this.indexMapAnimation);
  cwt.Screen.layerUnit.renderLayer(this.indexUnitAnimation);
  if (cwt.Gameflow.globalData.focusActive) cwt.Screen.layerFocus.renderLayer(this.indexFocus);

  if (cwt.DEBUG) console.log("shifted the screen (" + ((new Date()).getTime() - time) + "ms)");
};
/**
 * @type {null|HTMLCanvasElement}
 * @private
 */
cwt.MapRenderer.tmpCanv_ = null;

/**
 * Returns a temporary canvas (singleton)
 *
 * @return {HTMLCanvasElement}
 */
cwt.MapRenderer.getTempCanvas = function () {
  if (!this.tmpCanv_) {
    this.tmpCanv_ = document.createElement("canvas");
    this.tmpCanv_.width = cwt.Screen.width;
    this.tmpCanv_.height = cwt.Screen.height;
  }

  return this.tmpCanv_;
};