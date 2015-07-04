package org.wolftec.cwtactics.game.event.game.explode;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface ExplodeSelf extends SystemEvent {
  void onExplodeSelf(String unit);
}
