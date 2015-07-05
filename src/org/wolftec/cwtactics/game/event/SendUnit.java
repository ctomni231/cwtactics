package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface SendUnit extends SystemEvent {

  void onSendUnit(String unit, String target);
}
