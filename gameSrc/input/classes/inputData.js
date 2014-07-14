//
// Represents a given data set of an input call.
//
cwt.InputData = my.Class({
  constructor: function () {
    this.reset();
  },

  //
  // Resets the object data to a fresh state (no saved information).
  //
  reset: function() {
    this.key = -1;
    this.d1 = -1;
    this.d2 = -1;
  }
});
