/**
 *
 * @class
 */
cwt.UICustomField = my.Class( null, cwt.UIField, /** @lends cwt.UIField.prototype */ {

  constructor: function (x, y, w, h, key, drawFn) {
    cwt.UIField.call(this,x, y, w, h, key, 0, cwt.UIField.STYLE_NORMAL);
    this.text = "";
    this.draw = drawFn;
  }
});