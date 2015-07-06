package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface HideUnit extends SystemEvent {

  void onHideUnit(String unit);
}
