//
// @class
// @extends {cwt.UIButtonGroup}
//
cwt.UIPositionableButtonGroupObject = my.Class(null, cwt.UIButtonGroupObject, {

  constructor: function() {
    cwt.UIButtonGroupObject.call(this);
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
