package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface ClickEvent extends SystemEvent {
  public void onClick(String type, int x, int y);
}
