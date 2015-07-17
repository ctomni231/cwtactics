package org.wolftec.cwtactics.game.events.gameround;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface HideUnit extends SystemEvent {

  void onHideUnit(String unit);
}
