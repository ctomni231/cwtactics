package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.IEvent;

public interface GameEndEvent extends IEvent {
  void onGameEnd();
}
