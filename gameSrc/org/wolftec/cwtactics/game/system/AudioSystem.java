package org.wolftec.cwtactics.game.system;

import org.wolftec.cwtactics.game.ISystem;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.event.ClickEvent;

public class AudioSystem implements ISystem, ClickEvent {

  private Log log;

  @Override
  public void onClick(String type, int x, int y) {
    log.info("GOT A CLICK => " + type);
  }
}
