package org.wolftec.cwtactics.game.systems;

import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.game.core.CircularBuffer;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.events.system.FrameTick;
import org.wolftec.cwtactics.game.events.ui.IncomingMessage;

public class GameCommandSystem implements System, IncomingMessage, FrameTick {

  private CircularBuffer<String> messages;
  private Log                    log;

  @Override
  public void onConstruction() {
    messages = new CircularBuffer<String>(Constants.COMMAND_BUFFER_SIZE);
  }

  @Override
  public void onIncomingMessage(String message) {
    log.info("incoming network message, parsing command");
    messages.add(message);
  }

  @Override
  public void onNextTick(int delta) {
    if (!messages.isEmpty()) {
      String message = messages.popFirst();
      log.info("Evaluate command [" + message + "]");
      // TODO
    }
  }

}
