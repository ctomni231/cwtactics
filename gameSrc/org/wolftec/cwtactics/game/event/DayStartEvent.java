package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.IEvent;

public interface DayStartEvent extends IEvent {
  void onDayStart(int day);
}
