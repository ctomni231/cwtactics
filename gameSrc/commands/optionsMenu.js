cwt.Action.clientAction({
  key:"options",

  condition: function (data) {
    return true;
  },

  toDataBlock: function (data, dataBlock) {},

  parseDataBlock: function (dataBlock) {
    controller.screenStateMachine.event("toOptions_",true);
  }
});