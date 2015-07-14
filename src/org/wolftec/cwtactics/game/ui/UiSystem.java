package org.wolftec.cwtactics.game.ui;

import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.event.system.RawInput;
import org.wolftec.cwtactics.game.event.ui.TriggerAction;

public class UiSystem implements System, RawInput {

  private Log           log;

  private TriggerAction triggerAction;

  private GameState     appState;

  @Override
  public void onRawInput(String device, int type, int screenX, int screenY) {
    log.info("Got input from user [device:" + device + " type:" + type + " x:" + screenX + " y:" + screenY + "]");

    switch (appState) {

      case MENU:
        if (isButtonA(device, type)) {
          triggerAction.onTriggerAction("TODO");
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
