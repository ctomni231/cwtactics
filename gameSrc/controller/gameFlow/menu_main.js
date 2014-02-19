cwt.Gameflow.addState({
  id: "MAIN_MENU",

  init: function () {
    this.buttons = [
      "VERSUS",
      "OPTIONS"
    ];
  },

  enter: function () {
    this.rendered = false;
    this.index = 0;
  },

  update: function (delta, lastInput) {

    // last used input
    if (lastInput) {
      switch (lastInput.key) {

        // ----------------------------------------

        case cwt.Input.TYPE_DOWN:
          this.rendered = false;
          this.index++;
          if (this.index === this.buttons.length) {
            this.index = 0;
          }
          break;

        case cwt.Input.TYPE_UP:
          this.rendered = false;
          this.index--;
          if (this.index < 0) {
            this.index = this.buttons.length-1;
          }
          break;

        case cwt.Input.TYPE_ACTION:
          return this.buttons[this.index];

        case cwt.Input.TYPE_CANCEL:
          return "START_SCREEN";

        // ----------------------------------------
      }
    }
  },

  render: function () {

    // render buttons
    if (!this.rendered) {


      this.rendered = true;
    }
  }
});