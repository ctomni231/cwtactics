cwt.Gameflow.addState({
  id: "TILE_SELECTION",

  init: function () {

  },

  enter: function () {

  },

  update: function (delta, lastInput) {

  },

  render: function (delta) {

  }
});
         /*
cwt.gameFlow.ACTION_SELECT_TILE = {

  onenter: function () {
    this.data.targetselection.clean();

    var prepareSelection = this.data.action.object.prepareSelection;
    if (prepareSelection) prepareSelection(this.data);
    else this.data.selectionRange = 1;
  },

  action: function (ev, x, y) {
    if (this.data.action.object.isTargetValid(this.data, x, y)) {
      this.data.targetselection.set(x, y);

      return "FLUSH_ACTION";
    } else return this.breakTransition();
  },

  cancel: function () {
    this.data.targetselection.clean();
    return this.backToLastState();
  }

};         */