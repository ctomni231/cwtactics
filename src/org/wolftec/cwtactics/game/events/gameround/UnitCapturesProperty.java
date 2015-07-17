package org.wolftec.cwtactics.game.events.gameround;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface UnitCapturesProperty extends SystemEvent {
  void onUnitCapturesProperty(String capturer, String property);
}
