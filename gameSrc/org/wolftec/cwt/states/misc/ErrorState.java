package org.wolftec.cwt.states.misc;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSCollections;
import org.wolftec.cwt.environment.ResetSystem;
import org.wolftec.cwt.input.AbstractMenuState;
import org.wolftec.cwt.states.AbstractState;
import org.wolftec.cwt.states.GameActions;
import org.wolftec.cwt.states.UserInteractionMap;
import org.wolftec.cwt.system.Option;

public class ErrorState extends AbstractMenuState {

  private static final String UIC_RELOAD  = "RELOAD";
  private static final String UIC_WIPEOUT = "WIPEOUT";
  public String               message;
  public String               where;

  public UserInteractionMap   mapping;

  @Override
  public void onConstruction() {
    mapping.registerMulti(UIC_WIPEOUT, JSCollections.$array(GameActions.BUTTON_LEFT, GameActions.BUTTON_RIGHT), UIC_RELOAD);
    mapping.registerMulti(UIC_RELOAD, JSCollections.$array(GameActions.BUTTON_LEFT, GameActions.BUTTON_RIGHT), UIC_WIPEOUT);
    mapping.setState(UIC_RELOAD);
  }

  @Override
  public Option<Class<? extends AbstractState>> handleButtonA(int delta, String currentUiState) {
    if (mapping.getState() == UIC_RELOAD) {
      reloadWithoutWipe();
    } else {
      reloadWithWipe();
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
