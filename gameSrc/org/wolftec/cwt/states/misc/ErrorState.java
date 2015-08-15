package org.wolftec.cwt.states.misc;

import org.stjs.javascript.Global;
import org.wolftec.cwt.environment.ResetSystem;
import org.wolftec.cwt.input.InputManager;
import org.wolftec.cwt.states.State;
import org.wolftec.cwt.system.Maybe;

public class ErrorState implements State {

  public String message;
  public String where;

  @Override
  public Maybe<Class<? extends State>> update(int delta, InputManager input) {

    /*
     * 
     * TODO
     * 
     * from this state we can, in relation to the user interaction,
     * 
     * 1. reload the game
     * 
     * 2. reload the game while wiping the game storage out
     */

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
