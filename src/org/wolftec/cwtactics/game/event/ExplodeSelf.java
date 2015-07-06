package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface ExplodeSelf extends SystemEvent {
  void onExplodeSelf(String unit);
}
