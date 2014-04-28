cwt.Gameflow.addState({
  id: "MAIN_MENU",

  init: function () {
    this.buttons = new cwt.ButtonGroup(10,8);

    this.buttons.addButton(2,1,6,2,"MAIN_MENU_SKIRMISH",20);
    this.buttons.addButton(2,3,6,2,"MAIN_MENU_NETWORK",20);
    this.buttons.addButton(2,5,6,2,"MAIN_MENU_OPTIONS",20);
  },

  enter: function () {
    cwt.Screen.layerUI.clear();

    this.rendered = false;
    this.index = 0;
  },

  update: function (delta, lastInput) {
    if (lastInput) {
      switch (lastInput.key) {

        case cwt.Input.TYPE_UP:
        case cwt.Input.TYPE_DOWN:
          this.buttons.handleInput(lastInput);
          this.rendered = false;
          break;

        case cwt.Input.TYPE_ACTION:
          switch (this.buttons.activeButton().key) {
            case "MAIN_MENU_SKIRMISH":
              cwt.Gameflow.changeState("VERSUS");
              break;

            case "MAIN_MENU_NETWORK":
              break;

            case "MAIN_MENU_OPTIONS":
              cwt.Gameflow.changeState("OPTIONS");
              break;
          }
          break;

        case cwt.Input.TYPE_CANCEL:
          cwt.Gameflow.changeState("START_SCREEN");
          break;
      }
    }
  },

  render: function () {
    if (!this.rendered) {
      var ctx = cwt.Screen.layerUI.getContext();
      this.buttons.draw(ctx);
      this.rendered = true;
    }
  }
});