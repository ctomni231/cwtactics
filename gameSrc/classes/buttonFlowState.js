/**
 * Creates a state with a screen layout instance for menu states.
 *
 * @param desc
 * @param id
 * @param lastStateId
 * @param init
 */
cwt.ButtonFlowState = function (desc) {
  cwt.Gameflow.addState({
    id: desc.id,

    init: function () {
      this.layout = new cwt.UIScreenLayout();
      this.rendered = false;

      this.inputMove = function (x, y) {
        if (this.layout.updateIndex(x, y)) {
          this.rendered = false;
        }
      };

      desc.init.call(this,this.layout);

      if (desc.genericInput) {
        this.genericInput = desc.genericInput;
      }
    },

    enter: function () {
      cwt.Screen.layerUI.clear();
      this.rendered = false;

      if (desc.enter) {
        desc.enter.call(this);
      }
    },

    update: function (delta, lastInput) {
      if (lastInput) {
        switch (lastInput.key) {

          case cwt.Input.TYPE_LEFT:
          case cwt.Input.TYPE_RIGHT:
          case cwt.Input.TYPE_UP:
          case cwt.Input.TYPE_DOWN:
            if (this.layout.handleInput(lastInput)) {
              this.rendered = false;
            }
            break;

          case cwt.Input.TYPE_ACTION:
            var button = this.layout.activeButton();
            button.action.call(this,button,this);
            this.rendered = false;
            break;

          case cwt.Input.TYPE_CANCEL:
            if (desc.last) {
              cwt.Gameflow.changeState(desc.last);
            }
            break;
        }
      }
    },

    render: function (delta) {
      if (!this.rendered) {
        var ctx = cwt.Screen.layerUI.getContext();
        this.layout.draw(ctx);
        this.rendered = true;
      }
    }
  });
};