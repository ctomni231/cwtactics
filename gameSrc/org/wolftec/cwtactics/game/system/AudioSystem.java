package org.wolftec.cwtactics.game.system;

import org.wolftec.cwtactics.game.core.ConstructedClass;
import org.wolftec.cwtactics.game.core.Log;
import org.wolftec.cwtactics.game.event.ClickEvent;

public class AudioSystem implements ConstructedClass, ClickEvent {

  private Log log;

  @Override
  public void onClick(String type, int x, int y) {
    log.info("GOT A CLICK => " + type);
  }
}
