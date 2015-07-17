package org.wolftec.cwtactics.game.systems;

import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.events.system.RawInput;
import org.wolftec.cwtactics.game.events.ui.InvokeAction;

public class UiSystem implements System, RawInput {

  private Log          log;

  private InvokeAction triggerAction;

  private GameState    appState;

  @Override
  public void onRawInput(String device, int type, int screenX, int screenY) {
    log.info("Got input from user [device:" + device + " type:" + type + " x:" + screenX + " y:" + screenY + "]");

    switch (appState) {

      case MENU:
        if (isButtonA(device, type)) {
        }
        break;

      case GAMEROUND:
        break;
    }
  }

  private boolean isButtonA(String device, int type) {
    switch (device) {
      case "KEYBOARD":
        return type == 31;
      case "MOUSE":
        return type == 1;
      default:
        return false;
    }
  }
}
