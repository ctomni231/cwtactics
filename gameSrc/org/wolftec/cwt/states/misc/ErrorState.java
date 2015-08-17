package org.wolftec.cwt.states.misc;

import org.stjs.javascript.Global;
import org.wolftec.cwt.environment.ResetSystem;
import org.wolftec.cwt.input.InputManager;
import org.wolftec.cwt.states.GameActions;
import org.wolftec.cwt.states.State;
import org.wolftec.cwt.states.UserInteractionMap;
import org.wolftec.cwt.system.Maybe;

public class ErrorState implements State {

  public String             message;
  public String             where;

  public UserInteractionMap mapping;

  @Override
  public void onConstruction() {
    mapping.register("WIPEOUT", GameActions.BUTTON_LEFT, "RELOAD");
    mapping.register("WIPEOUT", GameActions.BUTTON_RIGHT, "RELOAD");
    mapping.register("RELOAD", GameActions.BUTTON_LEFT, "WIPEOUT");
    mapping.register("RELOAD", GameActions.BUTTON_RIGHT, "WIPEOUT");
    mapping.setState("RELOAD");
  }

  @Override
  public Maybe<Class<? extends State>> update(int delta, InputManager input) {
    if (input.isActionPressed(GameActions.BUTTON_LEFT)) {
      mapping.event(GameActions.BUTTON_LEFT);
    } else if (input.isActionPressed(GameActions.BUTTON_RIGHT)) {
      mapping.event(GameActions.BUTTON_RIGHT);
    }

    if (input.isActionPressed(GameActions.BUTTON_A)) {
      if (mapping.getState() == "RELOAD") {
        reloadWithoutWipe();
      } else {
        reloadWithWipe();
      }
    }

    return NO_TRANSITION;
  }

  private void reloadWithoutWipe() {
    Global.window.document.location.reload();
  }

  private void reloadWithWipe() {
    String newURL = Global.window.document.location.href;
    newURL = newURL.substring(0, newURL.indexOf("?")) + "?" + ResetSystem.PARAM_WIPEOUT + "=1";
    Global.window.document.location.replace(newURL);
  }
}
