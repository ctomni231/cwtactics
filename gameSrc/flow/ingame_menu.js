cwt.Gameflow.addState({
  id: "MENU",

  enter: function () {
    this.data.menu.clean();
    this.data.menu.generate();
    if (this.data.menu.size === 0) {
      //this.aw2.target.clean();
      return this.breakTransition();
    }

  },

  update: function (delta, input) {

  },

  render: function (delta) {

    // render layer 3
  },

  action: function (ev, index) {
    var action = this.data.menu.data[index];
    var actObj = controller.action_objects[action];

    this.data.action.selectedEntry = action;
    this.data.action.object = actObj;

    if (actObj.prepareMenu !== null) return "ACTION_SUBMENU";
    else if (actObj.isTargetValid !== null) return "ACTION_SELECT_TILE";
    else if (actObj.prepareTargets !== null &&
      actObj.targetSelectionType === "A") return this.data.selection.prepare();
    else return "FLUSH_ACTION";
  },

  cancel: function () {
    this.data.target.grab(this.data.source);
    return this.backToLastState();
  }
});