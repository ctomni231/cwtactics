package org.wolftec.cwt.states;

import org.wolftec.cwt.input.InputData;

/**
 * Adds a menu state (normally this means all states that aren't inGame plus have input connection). Every menu state will be designed with a **cwt.UIScreenLayout** which can be configured by the **doLayout(layout)** function property in the state description.
 * 
 */
public interface MenuState extends State {

  var layout = new widgets.UIScreenLayout();
  var rendered = false;
  
  void doLayout();
  
@Override
public void init() {

  this.inputMove = function(x, y) {
    if (layout.updateIndex(x, y)) {
      rendered = false;
    }
  };

  if (desc.init) {
    desc.init.call(this, layout);
  }

  if (desc.doLayout) {
    desc.doLayout.call(this, layout);
  }

  if (desc.genericInput) {
    this.genericInput = desc.genericInput;
  }

  this.doRender = function() {
    rendered = false;
  };
}

@Override
default void enter () {
  renderer.layerUI.clear(constants.INACTIVE);
  rendered = false;

  if (desc.enter) {
    desc.enter.call(this, layout);
  }
}

@Override
default void update (int delta, InputData lastInput) {
  if (lastInput) {
    switch (lastInput.key) {

      case input.TYPE_LEFT:
      case input.TYPE_RIGHT:
      case input.TYPE_UP:
      case input.TYPE_DOWN:
        if (layout.handleInput(lastInput)) {
          rendered = false;
          audio.playSound("MENU_TICK");
        }
        break;

      case input.TYPE_ACTION:
        var button = layout.activeButton();
        button.action.call(this, button, this);
        rendered = false;
        audio.playSound("ACTION");
        break;

      case input.TYPE_CANCEL:
        if (desc.last) {
          exports.changeState(desc.last);
          audio.playSound("CANCEL");
        }
        break;
    }
  }
},

@Override
default void render(int delta) {
  if (!rendered) {
    var ctx = renderer.layerUI.getContext(constants.INACTIVE);
    layout.draw(ctx);
    rendered = true;
  }
}
}
