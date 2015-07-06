package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface DayStart extends SystemEvent {

  void onDayStart(int day);
}
