/**
 *
 * @class
 */
cwt.ActionData = my.Class({

  STATIC: {

    /**
     * Converts an action data object to JSON.
     *
     * @param {cwt.ActionData} data
     * @return {string}
     */
    toJSON: function (data) {
      return JSON.stringify([data.id, data.p1, data.p2, data.p3, data.p4, data.p5]);
    },

    /**
     * Converts a JSON string to an action data object.
     *
     * @param {cwt.ActionData} data
     */
    fromJSON: function (data) {
      if (typeof  data === "string") {
        data = JSON.stringify(data)
      }

      this.id = data[0];
      this.p1 = data[1];
      this.p2 = data[2];
      this.p3 = data[3];
      this.p4 = data[4];
      this.p5 = data[5];
    }
  },

  constructor: function () {
    this.reset();
  },

  /**
   *
   */
  reset: function () {
    this.id = -1;
    this.p1 = -1;
    this.p2 = -1;
    this.p3 = -1;
    this.p4 = -1;
    this.p5 = -1;
  },

  toString: function () {
    return "ActionData::[id:"+this.id+" p1:"+this.p1+" p2:"+this.p2+" p3:"+this.p3+" p4:"+this.p4+" p5:"+this.p5+"]";
  }
});