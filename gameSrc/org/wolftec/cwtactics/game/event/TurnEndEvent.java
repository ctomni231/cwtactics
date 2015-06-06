package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.IEvent;

public interface TurnEndEvent extends IEvent {
  void onTurnEnd();
}
