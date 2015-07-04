package org.wolftec.cwtactics.game.event.game.turn;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface DayStart extends SystemEvent {

  void onDayStart(int day);
}
