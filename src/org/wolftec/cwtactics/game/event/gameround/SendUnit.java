package org.wolftec.cwtactics.game.event.gameround;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface SendUnit extends SystemEvent {

  void onSendUnit(String unit, String target);
}
