package org.wolftec.cwt.states.misc;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.log.Log;
import org.wolftec.cwt.states.base.AbstractMenuState;
import org.wolftec.cwt.states.base.GameActions;
import org.wolftec.cwt.states.base.StateFlowData;
import org.wolftec.cwt.states.base.StateManager;
import org.wolftec.cwt.system.SystemResetter;
import org.wolftec.cwt.ui.MenuInteractionMap;
import org.wolftec.cwt.util.ObjectUtil;

public class ErrorState extends AbstractMenuState {

  private static final String UIC_RELOAD = "RELOAD";
  private static final String UIC_WIPEOUT = "WIPEOUT";

  private String message;

  private MenuInteractionMap mapping;
  private Log log;

  private StateManager stm;

  @Override
  public void onConstruction() {
    mapping.registerMulti(UIC_WIPEOUT, JSCollections.$array(GameActions.BUTTON_LEFT, GameActions.BUTTON_RIGHT), UIC_RELOAD);
    mapping.registerMulti(UIC_RELOAD, JSCollections.$array(GameActions.BUTTON_LEFT, GameActions.BUTTON_RIGHT), UIC_WIPEOUT);
    mapping.setState(UIC_RELOAD);
    registerErrorHandler();
  }

  @Override
  public void onEnter(StateFlowData flowData) {
    log.warn("entered error state with error date [" + message + "]");
  }

  private void registerErrorHandler() {
    ErrorState that = this;
    ObjectUtil.setObjectProperty(Global.window, "onerror", (Callback1<String>) (error) -> {
      that.message = error;
      that.stm.changeState("ErrorState");
    });
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
    newURL = newURL.substring(0, newURL.indexOf("?")) + "?" + SystemResetter.PARAM_WIPEOUT + "=1";
    Global.window.document.location.replace(newURL);
  }
}
