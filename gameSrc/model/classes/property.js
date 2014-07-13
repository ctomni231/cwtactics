//
// @class
// @extends cwt.IndexMultiton
//
cwt.PropertyClass = my.Class({

  STATIC: {

    fromJSON: function(data) {

    },

    toJSON: function() {

    },

    CAPTURE_POINTS: 20,

    CAPTURE_STEP: 10
  },

  constructor: function() {
    this.points = 20;

    //
    // @type {cwt.Player}
    //
    this.owner = null;

    this.type = null;
  },

  //
  // Returns true, when the given property is neutral, else false.
  //
  isNeutral: function() {
    return this.owner === null;
  },

  makeNeutral: function() {
    this.owner = null;
  }

});
