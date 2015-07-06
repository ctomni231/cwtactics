package org.wolftec.cwtactics.game.action;

import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.game.core.CircularBuffer;
import org.wolftec.cwtactics.game.core.sysobject.Log;
import org.wolftec.cwtactics.game.core.systems.System;
import org.wolftec.cwtactics.game.event.IncomingMessage;

public class GameCommandSystem implements System, IncomingMessage {

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
}
