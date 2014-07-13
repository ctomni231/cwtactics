//
//
// @class
//
cwt.TileClass = my.Class({
  
  STATIC: {

    fromJSON: function(data) {

    },

    toJSON: function() {

    }
  },
  
  constructor: function() {
    this.type = null;
    this.unit = null;
    this.property = null;
    this.visionTurnOwner = 0;
    this.variant = 0;
    this.visionClient = 0;
  },

  //
  //
  // @return {boolean}
  //
  isOccupied: function() {
    return this.unit !== null;
  },

  //
  //
  // @return {boolean}
  //
  isVisible: function() {
    return this.visionTurnOwner > 0;
  }

});
