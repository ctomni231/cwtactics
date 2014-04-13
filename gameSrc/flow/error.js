cwt.Gameflow.addState({
  id: "ERROR_SCREEN",

  init: function () {
    this.activeCmd = 0;
    this.message = null;
    this.where = null;
  },

  enter: function () {
    this.rendered = false;
    this.activeCmd = 0;
    this.message = null;
    this.where = null;
  },

  update: function (delta, lastInput) {
    switch (lastInput) {

      case cwt.Input.TYPE_LEFT:
        if (this.activeCmd > 0) {
          this.activeCmd--;
        }
        break;

      case cwt.Input.TYPE_RIGHT:
        if (this.activeCmd < 2) {
          this.activeCmd++;
        }
        break;

      case cwt.Input.TYPE_ACTION :
        switch (this.activeCmd) {

          /* Restart */
          case 0: break;

          /* Wipe-Out Content and restart*/
          case 1: break;

          /* Send report and restart */
          case 2: break;
        }
        break;
    }
  },

  render: function (delta) {
    if (!this.rendered) {
      var ctxUI = cwt.Screen.interfaceLayer.getContext();

      cwt.DrawUtil.cleanContext(ctxUI);

      this.rendered = true;
    }
  }
});