cwt.gameFlow.IDLE = {
  onenter: function () {
    this.data.menu.clean();
    this.data.movePath.clean();

    this.data.action.selectedEntry = null;
    this.data.action.selectedSubEntry = null;
    this.data.action.object = null;

    this.clearHistory();

    this.data.inMultiStep = false;
    this.data.makeMultistep = true;

    this.data.source.clean();
    this.data.target.clean();
    this.data.targetselection.clean();
  },

  action: function (ev, x, y) {
    this.data.source.set(x, y);

    if (this.data.source.unitId !== INACTIVE_ID &&
      this.data.source.unit.owner === model.round_turnOwner &&
      model.actions_canAct(this.data.source.unitId)) {

      this.data.target.set(x, y);
      this.data.movePath.clean();
      this.data.movePath.move_fillMoveMap();

      // cannot move atm
      if (this.data.selection.getValueAt(x - 1, y) < 0 &&
        this.data.selection.getValueAt(x + 1, y) < 0 &&
        this.data.selection.getValueAt(x, y - 1) < 0 &&
        this.data.selection.getValueAt(x, y + 1) < 0) {

        this.data.target.set(x, y);
        return "ACTION_MENU";
      } else return "MOVEPATH_SELECTION";
    } else {
      this.data.target.set(x, y);
      return "ACTION_MENU";
    }
  },

  cancel: function (ev, x, y) {
    return this.breakTransition();
  }
};