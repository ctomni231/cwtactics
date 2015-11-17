package org.wolftec.cwt.controller.states.misc;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.controller.states.base.GameActionConstants;
import org.wolftec.cwt.controller.states.base.MenuState;
import org.wolftec.cwt.controller.states.base.MenuStateInteraction;
import org.wolftec.cwt.controller.states.base.StateFlowData;
import org.wolftec.cwt.controller.states.base.StateManager;
import org.wolftec.cwt.controller.urlConfig.SystemResetter;
import org.wolftec.cwt.core.ObjectUtil;
import org.wolftec.cwt.core.log.Log;

public class ErrorState extends MenuState implements GameActionConstants {

  private static final String UIC_RELOAD = "RELOAD";
  private static final String UIC_WIPEOUT = "WIPEOUT";

  private String message;

  private MenuStateInteraction mapping;
  private Log log;

  private StateManager stm;

  @Override
  protected void constructUI(MenuStateInteraction ui) {
    ui.registerMulti(UIC_WIPEOUT, JSCollections.$array(BUTTON_LEFT, BUTTON_RIGHT), UIC_RELOAD);
    ui.registerMulti(UIC_RELOAD, JSCollections.$array(BUTTON_LEFT, BUTTON_RIGHT), UIC_WIPEOUT);
    ui.setState(UIC_RELOAD);
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
