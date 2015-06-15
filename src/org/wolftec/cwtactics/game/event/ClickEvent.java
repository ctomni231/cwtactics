package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.IEvent;

public interface ClickEvent extends IEvent {
  public void onClick(String type, int x, int y);
}
