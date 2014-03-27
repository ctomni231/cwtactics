/**
 *
 * @class
 */
cwt.ActionData = my.Class({
  constructor: function () {
    this.reset();
  },

  reset: function () {
    this.id = -1;
    this.p1 = -1;
    this.p2 = -1;
    this.p3 = -1;
    this.p4 = -1;
    this.p5 = -1;
  },

  toJSON: function () {

    // [id,p1,p2,p3,p4,p5]
    return [this.id,this.p1,this.p2,this.p3,this.p4,this.p5];
  }
});