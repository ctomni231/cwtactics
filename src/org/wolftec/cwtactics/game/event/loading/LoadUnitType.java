package org.wolftec.cwtactics.game.event.loading;

import org.wolftec.cwtactics.game.core.sysevent.SystemEvent;

public interface LoadUnitType extends SystemEvent {
  void onLoadUnitType(String entity, Object data);
}
