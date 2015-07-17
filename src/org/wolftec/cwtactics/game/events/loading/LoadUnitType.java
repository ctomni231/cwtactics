package org.wolftec.cwtactics.game.events.loading;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface LoadUnitType extends SystemEvent {
  void onLoadUnitType(String entity, Object data);
}
