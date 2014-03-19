cwt.DayTicker = my.Class({
  constructor: function () {

    this.phase = 0;
    this.timer = 0;

    // link constructor as reset function
    this.reset = cwt.DayTicker.prototype.constructor;
  },

  update: function (delta) {

  },

  isDone: function () {
    return false;
  },

  draw: function (ctx) {

  },

  erase: function (ctx) {

  }
});