package org.wolftec.cwtactics.game.system;

import org.wolftec.cwtactics.game.ISystem;
import org.wolftec.cwtactics.game.event.ClickEvent;

public class AudioSystem implements ISystem, ClickEvent {

  @Override
  public void onClick(String type, int x, int y) {
    info("GOT A CLICK => " + type);
  }
}
