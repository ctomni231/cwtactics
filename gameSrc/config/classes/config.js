//
// @class
//
cwt.ConfigClass = my.Class({

  //
  // @param {Number} min
  // @param {Number} max
  // @param {Number} defaultValue
  // @param {Number=} step (default is 1)
  //
  constructor: function(min, max, defaultValue, step) {
    this.min = min;
    this.max = max;
    this.def = defaultValue;
    this.step = (step !== void 0) ? step : 1;
    this.userSelectable = true;
    this.resetValue();
  },

  //
  //
  // @param {Number} value
  //
  setValue: function(value) {

    // check_ bounds
    if (value < this.min) value = this.min;
    if (value > this.max) value = this.max;

    // check_ steps
    if ((value - this.min) % this.step !== 0) {
      cwt.assert(false, "step criteria is broken");
    }

    this.value = value;
  },

  decreaseValue: function() {
    this.setValue(this.value - this.step);
  },

  increaseValue: function() {
    this.setValue(this.value + this.step);
  },

  //
  // Resets the value of the parameter back to the default
  // value.
  //
  resetValue: function() {
    this.value = this.def;
  }

});
