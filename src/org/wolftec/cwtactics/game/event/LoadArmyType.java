package org.wolftec.cwtactics.game.event;

import org.wolftec.cwtactics.game.core.SystemEvent;

public interface LoadArmyType extends SystemEvent {
  void onLoadArmyType(String entity, Object data);
}
