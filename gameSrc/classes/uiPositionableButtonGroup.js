/**
 * @class
 * @extends {cwt.UIButtonGroup}
 */
cwt.UIPositionableButtonGroup = my.Class( null, cwt.UIButtonGroup, /** @lends cwt.UIPositionableButtonGroup.prototype */ {

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