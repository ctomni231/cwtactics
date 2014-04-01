cwt.Action.mapAction({
  key: "nextTurn",
  invoke: function () {
    cwt.Turn.next();
  }
})