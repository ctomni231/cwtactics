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

    if (typeof input!== "number") {
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