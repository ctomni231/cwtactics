package org.wolftec.cwtactics.game.event.persistence;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface LoadUnitType extends SystemEvent {
  void onLoadUnitType(String entity, Object data);
}
