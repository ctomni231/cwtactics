cwt.gameFlow.MULTISTEP_IDLE = {

  nextStep: function () {
    var actObj = this.data.action.object;

    this.data.movePath.clean();
    this.data.menu.clean();

    actObj.prepareMenu(this.data);
    this.data.menu.addEntry("done");

    this.data.inMultiStep = true;
    return (this.data.menu.size > 1) ? "ACTION_SUBMENU" : "IDLE";

  },

  nextStepBreak: function () {
    return "IDLE";
  }

};