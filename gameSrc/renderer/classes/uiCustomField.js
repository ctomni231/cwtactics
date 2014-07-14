//
//
// @class
// @extends {cwt.UIField}
//
cwt.UICustomFieldObject = my.Class(null, cwt.UIFieldObject, {

  constructor: function(x, y, w, h, key, drawFn) {
    cwt.UIFieldObject.call(this, x, y, w, h, key, 0, cwt.UIFieldObject.STYLE_NORMAL);
    this.text = "";
    this.draw = drawFn;
  }
});
