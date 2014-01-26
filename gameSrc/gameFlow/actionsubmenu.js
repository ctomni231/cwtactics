cwt.gameFlow.ACTION_SUBMENU = {
  onenter: function () {
    if (!this.data.inMultiStep) {
      this.data.menu.clean();
      this.data.action.object.prepareMenu(this.data);
      if (this.data.menu.size === 0) {
        assert(false, "sub menu cannot be empty");
      }
    }
  },

  action: function (ev, index) {

    // break transition when entry is disabled
    if (!this.data.menu.enabled[index]) {
      return this.breakTransition();
    }

    var action = this.data.menu.data[index];

    if (action === "done") {
      return "IDLE";
    }

    this.data.action.selectedSubEntry = action;

    if (this.data.action.object.prepareTargets !== null &&
      this.data.action.object.targetSelectionType === "B") {

      return this.data.selection.prepare();
    } else return "FLUSH_ACTION";
  },


  cancel: function () {
    if (this.data.inMultiStep) return this.backToLastState();

    this.data.menu.clean();
    this.data.menu.generate();

    return this.backToLastState();
  }
};