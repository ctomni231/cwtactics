package org.wolftec.cwtactics.game.events.gameround;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface SendUnit extends SystemEvent {

  void onSendUnit(String unit, String target);
}
