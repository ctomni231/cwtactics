var states = require('../statemachine');
var stateData = require('../dataTransfer/states');

exports.action = {
  condition: function () {
    return true;
  },

  toDataBlock: function () {},

  parseDataBlock: function () {
    stateData.fromIngameToOptions = true;
    states.changeState("MENU_OPTIONS");
  }
};