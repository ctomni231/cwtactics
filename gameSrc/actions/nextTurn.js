"use strict";

require('../actions').mapAction({
  key: "nextTurn",

  toDataBlock: function (data, dataBlock) {
  },

  parseDataBlock: function (dataBlock) {
    this.invoke();
  },

  invoke: function () {
    cwt.Turn.next();
  }
})