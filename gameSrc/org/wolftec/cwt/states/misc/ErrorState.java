package org.wolftec.cwt.states.misc;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSCollections;
import org.wolftec.cwt.core.env.ResetSystem;
import org.wolftec.cwt.core.state.AbstractMenuState;
import org.wolftec.cwt.core.state.GameActions;
import org.wolftec.cwt.core.state.StateFlowData;
import org.wolftec.cwt.core.state.MenuInteractionMap;

public class ErrorState extends AbstractMenuState {

  private static final String UIC_RELOAD  = "RELOAD";
  private static final String UIC_WIPEOUT = "WIPEOUT";
  public String               message;
  public String               where;

  public MenuInteractionMap   mapping;

  @Override
  public void onConstruction() {
    mapping.registerMulti(UIC_WIPEOUT, JSCollections.$array(GameActions.BUTTON_LEFT, GameActions.BUTTON_RIGHT), UIC_RELOAD);
    mapping.registerMulti(UIC_RELOAD, JSCollections.$array(GameActions.BUTTON_LEFT, GameActions.BUTTON_RIGHT), UIC_WIPEOUT);
    mapping.setState(UIC_RELOAD);
  }

  @Override
  public void handleButtonA(StateFlowData transition, int delta, String currentUiState) {
    if (mapping.getState() == UIC_RELOAD) {
      reloadWithoutWipe();
    } else {
      reloadWithWipe();
    }
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
